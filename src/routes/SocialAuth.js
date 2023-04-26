const express = require("express");
const router = express.Router();

const refresh = require('passport-oauth2-refresh');
const passport = require("passport");
require("../utils/passportHelp");
require("dotenv").config();

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies
        });
    }
});

/* router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
}); */

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], accessType: 'offline' },));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/social/login/failed", }),
    function (req, res) {
        res.cookie('user', JSON.stringify(req.user.user.dataValues), { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('refresh_token', req.user.refreshToken, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('access_token', req.user.accessToken, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('cart', req.user.cart, { maxAge: 24 * 60 * 60 * 1000 });
        res.redirect(process.env.CLIENT_URL);
    }
);

/* router.post('/google/refresh', function(req, res) {
    refresh.requestNewAccessToken('google', req.body.refreshToken, function(err, accessToken, refreshToken) {
        if (err) {
            // Xử lý lỗi
            console.log(err);
        } else {
            console.log( accessToken);
            console.log( refreshToken);
            res.redirect(process.env.CLIENT_URL);
        }
    });
}); */

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/api/social/login/failed",
    })
);

module.exports = router;