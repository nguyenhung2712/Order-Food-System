const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { User, Token, RefreshToken, Cart } = require("../models");
const sendEmail = require("../utils/sendEmail");
const userService = require("./user");
/* const tokenService = require("./Token"); */

const register = ({ ...reqBody}) => new Promise(async (resolve, reject) => {
    try {
        const {roles, password, ...body} = reqBody;
        bcrypt.hash(password, 10).then(async (hash) => {
            await userService.createUser({
                ...body,
                id: uuidv4(),
                password: hash,
                phoneNum: null,
                lastLogin: null,
                deletedAt: null,
                gender: null,
                avatar: null,
                isActived: 0,
                is2FA: 0,
                status: 1,
            })
                .then(async (response) => {
                    let user = response.payload;
                    await Cart.create({
                        total: 0,
                        deletedAt: null,
                        status: 1,
                        userId: user.id
                    });
                    const token = Token.createToken(user);
                    const link = `${process.env.MAIL_BASE_URL}/confirm-email/${user.id}/${token.token}`;
                    await sendEmail(user.email, "Confirm your account's email address", link);
                    resolve({
                        status: "success",
                        message: "Register Successful",
                        payload: response
                    });
                });
        });
    } catch (error) {
        reject(error);
    }
});

const confirmMail = (token, userId) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: {
                exclude: ['CartId', 'ConversationId']
            },
        });

        if (!user) {
            reject({ 
                status: "error",
                message: "Invalid link" 
            });
        }
        
        let currToken = await Token.findOne({ 
            where: { 
                userId: user.id, 
                token: token
            }
        });

        if (!currToken) {
            reject({ 
                status: "error",
                message: "Invalid link" 
            });
        }
    
        await User.update(
            { isActived: 1, },
            { where: { username: user.username } }
        ).then(user => {
            resolve({
                status: "success",
                message: "Confirm email successfully",
                payload: user
            });
        });
    } catch (error) {
        reject(error);
    }
})

const login = (username, password) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { username: username },
            attributes: {
                exclude: ['CartId', 'ConversationId']
            },
        });
        if (!user) {
            resolve({ 
                status: "error",
                message: "User Doesn't Exist!" 
            });
        }
        if (user.is2FA) {
            //gửi otp mail
        } else {
            bcrypt.compare(password, user.password).then(async (match) => {
                if (!match) reject({ 
                    status: "error" ,
                    message: "Wrong Username And Password Combination" 
                });
    
                let token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRATION,
                });
                let refreshToken = await RefreshToken.createToken(user);
    
                resolve({
                    status: "success",
                    message: "Login successfully",
                    payload: {
                        user,
                        accessToken: token,
                        refreshToken: refreshToken
                    }
                });
            });
        }
    } catch (error) {
        reject(error);
    }
})

const refreshToken = (requestToken) => new Promise(async (resolve, reject) => {
    if (!requestToken) {
        reject({ 
            status: "error",
            message: "Refresh Token is required!" 
        });
    }
    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            reject({ 
                status: "error",
                message: "Refresh token is not in database!" 
            });
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });
            
            reject({
                status: "error",
                message: "Refresh token was expired. Please make a new signin request",
            });
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: authConfig.jwtExpiration,
        });

        resolve({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        reject({ 
            status: "error",
            message: err 
        });
    }
});

module.exports = {
    login,
    register,
    confirmMail,
    refreshToken
}