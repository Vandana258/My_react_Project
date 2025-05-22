const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "Access Denied: No Token Provided!"
    });
  }

  try {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      next();
    });
      
  } catch (err) {
    res.status(401).send({
      success: false,
      message:"Access Denied: Invalid Token!"
    });
  }

};

// const isSuperAdmin = (req, res, next) => {
//   User.findByPk(req.userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).send({ success: false, message: "User Not Found." });
//       }      
//       if (user.role === "SuperAdmin") {
//         next();
//         return;
//       }
//       // If the role is not "SuperAdmin", return a 403 error
//       res.status(403).send({
//         success: false, 
//         message: "Require SuperAdmin Role!"
//       });
//     })
//     .catch(err => {
//       res.status(500).send({ success: false, message: err.message });
//     });
// };

// isClient = (req, res, next) => {
//   User.findByPk(req.userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).send({ success: false, message: "User Not Found." });
//       }      
//       if (user.role === "Client") {
//         next();
//         return;
//       }
//       // If the role is not "Client", return a 403 error
//       res.status(403).send({
//         success: false,
//         message: "Require Client Role!"
//       });
//     })
//     .catch(err => {
//       res.status(500).send({  success: false, message: err.message });
//     });
// };

// const isClientOrSubClient = (req, res, next) => {
//   User.findByPk(req.userId)
//     .then(user => {
//       if (!user) {
//         return res.status(404).send({  success: false, message: "User Not Found." });
//       }
//       if (user.role === "Client" || user.role === "SubClient") {
//         next();
//         return;
//       }
//       res.status(403).send({
//         success: false, 
//         message: "Require Client or SubClient Role!"
//       });
//     })
//     .catch(err => {
//       res.status(500).send({  success: false, message: err.message });
//     });
// };

const authJwt = {
  verifyToken: verifyToken,
  // isSuperAdmin: isSuperAdmin,
  // isClient: isClient,
  // isClientOrSubClient: isClientOrSubClient
};
module.exports = authJwt;