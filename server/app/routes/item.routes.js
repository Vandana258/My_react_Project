const authJwt = require('../middleware/authJwt')
const controller = require('../controllers/item.controller');

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
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const dateTime = `${date}`;

    const fileName = `${originalName}-${dateTime}${extension}`;
    cb(null, fileName); // Ensure unique filenames
  }
  // filename: function (req, file, cb) {
  //   cb(null, req.body.id + path.extname(file.originalname) );
  // }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
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
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/item/create", [authJwt.verifyToken], upload.single('image'), controller.create);
  app.get("/api/item/findall", [authJwt.verifyToken], controller.findAll);
  app.get("/api/item/findone", [authJwt.verifyToken], controller.findOne);
  app.put("/api/item/update", [authJwt.verifyToken], upload.single('image'),controller.update);
  app.put("/api/item/status-change", [authJwt.verifyToken], upload.single('image'),controller.statusChange);
}