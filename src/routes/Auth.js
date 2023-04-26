const express = require("express");
const router = express.Router();

const passport = require("passport");
/* require("../utils/googleAuth"); */
const session = require('express-session');

const { Auth, VerifyUserUpsert } = require("../middlewares");
const { authController } = require("../controllers");

/* function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
} */

/* router.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());

router.get('/', (req, res) => {
    res.send('<a href="/api/auth/google">Auth with google</a>')
});

router.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${JSON.stringify(req.user)}`);
});

router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/api/auth/protected',
        failureRedirect: '/api/auth/google/failure'
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
});
  
router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
}); */

router.get('/admin/profile', authController.staffProfile);
router.post('/refreshtoken', authController.refreshToken);
router.post('/send-otp', authController.sendOTP);
router.post('/forget-password', authController.forgetPassword);
router.post('/verify-otp-login', authController.userLoginVerifyOTP);
router.post('/verify-otp-fp', authController.userFPVerifyOTP);
router.post('/register/staff', authController.staffRegister);
router.post('/register/user', [VerifyUserUpsert.checkExistedEmail], authController.userRegister);
router.post('/login/:type', authController.login);
router.put('/confirm-mail/:id/:token', authController.confirmMail);

module.exports = router;