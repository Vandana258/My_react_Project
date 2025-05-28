const controller = require('../controllers/auth.controller');
const authJwt = require('../middleware/authJwt');
module.exports = app => {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/api/auth/login', controller.login);
    app.post('/api/auth/sign-up', controller.signup);
    app.post('/api/auth/setup2FA', controller.setup2FA);
    app.post('/api/auth/verify2FA',controller.verify2FA);
}