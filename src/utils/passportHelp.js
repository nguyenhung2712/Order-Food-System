const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const refresh = require('passport-oauth2-refresh');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { User, Cart } = require("../models");
const password = require("../utils/generateStr");
const sendEmail = require("../utils/sendEmail");

require("dotenv").config();
/* passport.use(new FacebookStrategy(
    {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_API_SECRET,
        callbackURL: process.env.FB_CALLBACK_URL,
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'email', 'name', 'picture'],
        enableProof: true
    },
    function(accessToken, refreshToken, profile, cb) {
        console.dir(profile);
        // save the profile on the Database
        // Save the accessToken and refreshToken if you need to call facebook apis later on
        return cb(null, profile);
    }
)); */

let ggStragy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/social/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
        let email = profile.emails[0].value;
        let pw = password.generatePW();
        let user = await User.findOne({ where: { email } });
        if (!user) {
            bcrypt.hash(pw, 10).then(async (hash) => {
                await User.create({
                    id: uuidv4(),
                    email: profile.emails[0].value,
                    firstName: profile.name.familyName,
                    lastName: profile.name.givenName,
                    password: hash,
                    isActived: 1,
                    is2FA: 0,
                    lastLogin: new Date(),
                    status: 1,
                    avatar: profile.photos[0].value,
                })
                    .then(async (user) => {
                        await sendEmail(user.email, "Mật khẩu đăng nhập", `Đây là mật khẩu đăng nhập dành cho phiên đăng nhập sau của bạn: ${pw}`);
                        await Cart.create({
                            id: uuidv4(),
                            deletedAt: null,
                            status: 1,
                            userId: user.id
                        })
                            .then(cart => {
                                done(null, { user: user, cart: cart, accessToken: accessToken, refreshToken: refreshToken });
                            });
                    });
            })
        } else {
            await Cart.findOne({ where: { userId: user.id } })
                .then(cart => {
                    console.log(cart);
                    done(null, { user: user, cart: cart, accessToken: accessToken, refreshToken: refreshToken });
                });
        }
    }
);

passport.use(ggStragy);
refresh.use(ggStragy);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FB_APP_ID,
            clientSecret: process.env.FB_API_SECRET,
            callbackURL: "/api/social/facebook/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            done(null, profile, { user: profile });
        }
    )
);

passport.serializeUser((req, user, done) => {
    /* console.log(user); */
    done(null, user);
});

passport.deserializeUser((user, done) => {
    /* console.log(user); */
    done(null, user);
});