const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { User, Info, Token, Role, RefreshToken } = require("../models");
const authConfig = require("../config/auth.config");

const { validateToken } = require("../middlewares/Auth");
const { checkExistedUsernameOrEmail } = require("../middlewares/VerifySignup");

const sendEmail = require("../utils/sendEmail");
const db = require("../models");
const config = require(__dirname + "/../config/config.json")["email"];

router.post("/register", checkExistedUsernameOrEmail, async (req, res) => {
    const { username, password, email, firstName, lastName, mobileNumber } = req.body;

    const rawInfo = await db.sequelize.query('SELECT username, email FROM users', {
        nest: true,
        type: db.sequelize.QueryTypes.SELECT
    });
    let isExistedUsername = Array.from(rawInfo).some(info => info.username === username);
    let isExistedEmail = Array.from(rawInfo).some(info => info.email === email);
    if (isExistedUsername) {
        res.json({
            status: "error",
            text: "Your username has been used, Please enter another username!"
        });
    }
    if (isExistedEmail) {
        res.json({
            status: "error",
            text: "Your email has been used, Please enter another email!"
        });
    }
    bcrypt.hash(password, 10).then((hash) => {
        const info = {
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR-l27mIia8PZNl8CAp-E65971pr0dLEfnwgOeOLIVHErs7yEixuAQ8hEd9gAbArgNAw4&usqp=CAU",
            lastUpdated: new Date(),
            isEnabled: 1
        };
        Info.create(info)
            .then(infoRes => {
                User.create({
                    username: username,
                    password: hash,
                    email: email,
                    lastLogin: new Date(),
                    registeredAt: new Date(),
                    isActived: 0,
                    isOTP: 0,
                    isEnabled: 1,
                })
					.then(userRes => {
						userRes.setInfo(infoRes);
                        if (req.body.roles) {
                            Role.findAll({
                                where: { 
                                    name: {
                                        [Op.or]: req.body.roles
                                    }
                                }
                            }).then(roles => {
                                userRes.setRoles(roles);
                            });
                        } else {
                            userRes.setRoles(["13266a91-b2c7-11ed-913b-d8d09055bd1c"]);
                        }
                        Token.create({
                            token: uuidv4(),
                            createdAt: new Date(),
                        })
                            .then(async (res) => {
                                res.setUser(userRes);
                                const link = `${config.base_url}/confirm-email/${userRes.id}/${res.token}`;
                                await sendEmail(userRes.email, "Confirm your account's email address", link);
                            });;
					});
            });
        res.json({
            status: "success",
            text: "Register Successful"
        });
    });
});

router.post("/confirm-email/:userId/:token", async (req, res) => {
    const { userId, token } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
        return res.json({ 
            status: "error",
            text: "Invalid link" 
        });
    }

    let currToken = await Token.findOne({ 
        where: { 
            UserId: user.id, 
            token: token
        } 
    });

    if (!currToken) {
        return res.json({ 
            status: "error",
            text: "Invalid link" 
        });
    }
    User.update(
        { isActived: 1, },
        { where: { username: user.username } }
    )
    res.json({
        status: "success",
        text: "Confirm email successfully"
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ 
        where: { username: username },
        /* include: {
            model: Role,
            attributes: ["name"]
        } */
     });

    if (!user) res.json({ 
        status: "error",
        text: "User Doesn't Exist" 
    });
                        
    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) res.json({ error: "Wrong Username And Password Combination" });

        let token = jwt.sign({ username: user.username, id: user.id }, authConfig.secret, {
            expiresIn: authConfig.jwtExpiration,
        });
        let refreshToken = await RefreshToken.createToken(user);
        let authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].dataValues.name.toUpperCase());
            }
            res.json({
                status: "success",
                text: "Login successfully",
                user,
                accessToken: token,
                refreshToken: refreshToken,
                roles: authorities
            });
        });
    });
});

router.post("/refresh-token", validateToken, async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });
            
            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: authConfig.jwtExpiration,
        });

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
});

router.post("/reset-password", validateToken, async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        res.json({ 
            status: "error",
            text: "User Doesn't Exist" 
        });
    }
    let token = await Token.findOne({ where: { UserId: user.id } });
    if (!token) {
        Token.create({
            token: crypto.randomBytes(32).toString("hex"),
            createdAt: new Date(),
        })
            .then(async (res) => {
                res.setUser(user);
                const link = `${config.base_url}/reset-password/${user.id}/${res.token}`;
                await sendEmail(user.email, "Reset your account's password", link);
            });;
    }
});

router.post("/reset-password/:userId/:token", validateToken, async (req, res) => {
    const { userId, token } = req.params;
    const { password } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
        return res.json({ 
            status: "error",
            text: "Invalid link" 
        });
    }

    let currToken = await Token.findOne({ 
        where: { 
            UserId: user.id, 
            token: token
        } 
    });

    if (!currToken) {
        return res.json({ 
            status: "error",
            text: "Invalid link" 
        });
    }
    bcrypt.hash(password, 10).then((hash) => {
        User.update(
            { password: hash, },
            { where: { username: user.username } }
        )
        Token.destroy({
            where: { id: currToken.id }
        })
        res.json({
            status: "success",
            text: "Reset password successfully"
        });
    });

});

module.exports = router;