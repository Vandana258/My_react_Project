const db = require('../models');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const utility  = require('../utilities/utility');
const SendEmail = require("../config/email.config");
const BASE_URL = process.env.BASE_URL;

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.send({ success: false, message: "All fields are required" });
    }

    try {
        // Check if email already exists
        const existingUser = await db.users.findOne({ where: { email } });
        if (existingUser) {
            return res.send({ success: false, message: "Email already in use" });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.users.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Client',  // default role
            status: '1'
        });

        const token = jwt.sign({ id: newUser.id }, config.secret, { expiresIn: 86400 });

        res.send({
            success: true,
            message: "User registered successfully",
            data: { ...newUser.dataValues, token }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({
            success: false,
            message: "Please provide email and password",
        });
    }
    try {
        const user = await db.users.findOne({ where: { email } });
        if (!user) {
            return res.send({ success: false, message: "User Not found." });
        }

        if (user.status !== '1' || !user.password) {
            return res.send({ success: false, message: "User not allowed to login!" });
        }

        const correctCredentials = await bcrypt.compare(password, user.password);
        if (!correctCredentials) {
            return res.send({ success: false, message: "Incorrect password!" });
        }

        const host = req.headers['x-forwarded-host'] || req.headers['host'];
        const protocol = req.protocol;

        if (user.image) {
            user.image = `${protocol}://${host}/assets/profileimages/${user.image}`;
        }

        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
        user.dataValues.token = token;

        // If 2FA is enabled
        if (user.two_fa_secret) {
                return res.send({
                    success: true,
                    requires2FA: true,
                    message: "Login successful!",
                    data: user,
                    userId: user.id,
                    // qrCode: data_url,
                    // secret: user.two_fa_secret
                });
        } else {
            // No 2FA
            return res.send({
                success: true,
                message: "Login successful!",
                data: user,
                userId: user.id
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: err.message || "An error occurred while logging in."
        });
    }
};

exports.forgotPassword = async (req, res) => {
    let email = req.body.email;
    try {
        const user = await db.users.findOne({ where: { 'email': email } });
        if (user) {
            const password = utility.GenerateRandomPassword(8);
            let encryptedPassword = await bcrypt.hash(password, 10);
            var data = await db.users.update({ password: encryptedPassword }, { where: { 'email': email } });
            if (data) {
                 let context = {}
                context.link = BASE_URL + 'login'
                context.name = await utility.showStringToFirstCharacterInUpperCase(user.name)
                context.user_email = req.body.email
                context.user_pass = password
                await SendEmail.sendMail(req.body.email, "vandana project - Password Reset Notification", context, "forgot_password");
                response = { success: true, message: "An email with the new password has been sent to the registered email id." }
            }
        }
        else {
            response = { success: true, message: "User with this email Not Found." }
        }
        return res.send(response);
    } catch (e) {
        res.send({ success: false, message: 'Try Again!! ' + e });
    }
}

// exports.CheckIsEmailAlreadyExist = async (req, res) => {
//   const { email , id, userType} = req.body;
//   if (!email) {
//       return res.send({ success: false, message: "Email is required" });
//   }
//   if (!userType){
//     return res.send({ success: false, message: "UserType is required" });
//   }
//   let condition = { deletedAt: null, email };

//   if(req.body.id > 0) {
//     condition.id = { [Op.not]: id } 
//   }

//   let tableName = db.users;
//   if (userType === 'client'){
//     tableName = db.users;
//   } else if (userType === 'supplier'){
//     tableName = db.suppliers;
//   }

//   try {
//       const user = await tableName.findOne({
//         where: condition
//       });
//       if (user) {
//           return res.send({ success: true, message: "Email already exists!", exists: true });
//       } else {
//           return res.send({ success: true, message: "Email does not exist", exists: false });
//       }
//   } catch (error) {
//       console.error("Error checking email existence:", error);
//       return res.status(500).send({ success: false, message: "Server error" });
//   }
// };

exports.setup2FA = async (req, res) => {
    const { email } = req.body; 

    const secret = speakeasy.generateSecret({
        name: (`${email}`)
    });
    // Save secret.base32 to user's record in DB
    await db.users.update({ two_fa_secret: secret.base32 }, { where: { email } });

    // Generate QR Code
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) {
            return res.status(500).send({ success: false, message: "Error generating QR code" });
        }
        res.send({ success: true, qrCode: data_url, secret: secret.base32 });
    });
};

exports.verify2FA = async (req, res) => {
    const { id, token } = req.body;

    if (!id || !token) {
        return res.status(400).send({ success: false, message: "User ID and token required" });
    }

    const user = await db.users.findByPk(id);
    if (!user || !user.two_fa_secret) {
        return res.status(400).send({ success: false, message: "Invalid user or 2FA not setup" });
    }

    const verified = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token
    });

    if (!verified) {
        return res.send({ success: false, message: "Invalid 2FA token" });
    }

    const jwtToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400
    });

    user.dataValues.token = jwtToken;

    res.send({ success: true, message: "Verfication Complete!", data: user });
};

