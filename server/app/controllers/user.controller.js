const db = require('../models');
const Op = db.Sequelize.Op;
const path = require("path");
const bcrypt = require("bcryptjs");
const Utility = require('../utilities/utility');

exports.updateProfile = async (req, res) => {
    const { id, name, email, lastName, address1, state, country, phone } = req.body;

    // Validate required fields
    if (!id || !name || !email) {
        return res.status(400).send({
            success: false,
            message: "Invalid data. 'id', 'name', and 'email' are required.",
        });
    }

    try {
        const existingUser = await db.users.findOne({ where: { email, id: { [Op.not]: id } }, raw: true, });
        if (existingUser) {
            return res.status(400).send({ success: false, message: "Email already exists." });
        }

        let updateData = { name, lastName, email, address1, state, country, phone };

        // const protocol = req.headers["cf-visitor"]
        // ? JSON.parse(req.headers["cf-visitor"]).scheme
        // : req.headers["x-forwarded-proto"] || req.protocol;
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.headers["x-forwarded-host"] || req.headers["host"];
        const imgBaseUrl = `${protocol}://${host}/profileImage/`;
        
        if (req.file) {
            try {
                const fileName = `${req.userId}${path.extname(req.file.originalname)}`;
                console.log("fileName",fileName)
                updateData.image = fileName;
            } catch (error) {
                return res.status(500).send({
                    success: false,
                    message: `Failed to process uploaded file. Error: ${error.message}`,
                });
            }
        }

        console.log("updateData",updateData);

        const [updateCount] = await db.users.update(updateData, { where: { id } });
        if (!updateCount) {
            return res.status(400).send({
                success: false,
                message: "Profile could not be updated. Please try again!",
            });
        }

        // Fetch updated user data
        const updatedUser = await db.users.findByPk(id);
        return res.status(200).send({
            success: true,
            message: "Profile has been updated successfully.",
            data: updatedUser,
            imgBaseUrl: imgBaseUrl
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `An error occurred while updating the profile. ${error.message}`,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ success: false, message: "Password is required."});
        }
        if (!Utility.isPasswordValid(password)) {
            return res.status(400).send({ success: false, message: "Password must be at least 8 characters, including a lowercase letter, uppercase letter, number, and special character." });
        }

        // Check if user exists
        const user = await db.users.findByPk(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found." });
        }

        // Encrypt password and update user record
        const encryptedPassword = await bcrypt.hash(password, 10);
        await db.users.update({ password: encryptedPassword }, { where: { id: userId } });

        return res.status(200).send({ success: true, message: "Password updated successfully." });

    } catch (error) {
        return res.status(500).send({ success: false, message: "An error occurred while updating the password.", error: error.message });
    }
};

exports.checkValidatePassword = async (req, res) => {
    const password = req.body.password;
    if (!password) {
      res.send({ success:false, message:"Password is missing.", });
    }  
    try {
        db.users.findOne({where: { id: req.body.id }
        }).then(async user => {
            if (!user) {
                res.send({status:false, message: "User Not found." });
            }
            let correctPassword = await bcrypt.compare(password, user.password);
            if (correctPassword) {
                res.send({ success:true, message:"Password is correct!", exists:true});
            }
            else{
                res.send({ success:false, message:"Incorrect Password!", exists:false });
            }  
        })
        .catch(err => {
            res.status(500).send({ 
                success: false, 
                message: err.message || "Try Again.." 
            });
        });
    } catch (e) {
        res.send({ 
            success:false, 
            message:"Something went wrong.", 
            data:e 
        });
    }  
};