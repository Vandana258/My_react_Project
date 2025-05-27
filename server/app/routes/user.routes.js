const authJwt = require('../middleware/authJwt')
const controller = require('../controllers/user.controller');

const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, '../../assets/uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.id + path.extname(file.originalname) );
  }
});

const upload = multer({ 
  storage: storage, 
  fileFilter: (req, file, cb) => {
    console.log("file.mimetype=====",file.mimetype)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error("image should be png or jpeg extension"), false)
    }
  },
    limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/users/updateProfile", [authJwt.verifyToken],  upload.single('image'), controller.updateProfile);
    app.post("/api/users/changepassword", [authJwt.verifyToken], controller.changePassword);
    app.post("/api/users/checkvalidatepassword", [authJwt.verifyToken], controller.checkValidatePassword);
}