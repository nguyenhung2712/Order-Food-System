const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { User, Token, RefreshToken, Cart, AdminStaff } = require("../models");
const sendEmail = require("../utils/sendEmail");
const { getAdminRoleByAdminId } = require("./role");

const userRegister = ({ ...reqBody}) => new Promise(async (resolve, reject) => {
    try {
        const {password, ...body} = reqBody;
        bcrypt.hash(password, 10).then(async (hash) => {
            await User.create({
                ...body,
                id: uuidv4(),
                password: hash,
                username: null,
                phoneNum: null,
                lastLogin: null,
                deletedAt: null,
                disabledAt: null,
                gender: null,
                avatar: null,
                isActived: 0,
                is2FA: 0,
                status: 1,
            })
                .then(async (user) => {
                    await Token.createToken(user)
                        .then(async (token) => {
                            let { password, ...res } = user;
                            const link = `${process.env.MAIL_BASE_URL}/confirm-email/${user.id}/${token}`;
                            await sendEmail(user.email, "Confirm your account's email address", link);
                            resolve({
                                status: "success",
                                message: "Register Successful",
                                payload: res
                            });
                        });
                        
                });
        });
    } catch (error) {
        reject(error);
    }
});

const staffRegister = ({ ...reqBody}) => new Promise(async (resolve, reject) => {
    try {
        const {password, ...body} = reqBody;
        bcrypt.hash(password, 10).then(async (hash) => {
            await AdminStaff.create({
                ...body,
                id: uuidv4(),
                password: hash,
                username: null,
                phoneNum: null,
                lastLogin: null,
                deletedAt: null,
                disabledAt: null,
                isActived: 0,
                status: 1,
            })
                .then(async (staff) => {
                    resolve({
                        status: "success",
                        message: "Register Successful",
                        payload: staff
                    });
                });
        });
    } catch (error) {
        reject(error);
    }
});

const confirmMail = (token, userId) => new Promise(async (resolve, reject) => {
    try {
        
        let currToken = await Token.findOne({ 
            where: { userId, token }
        });

        if (!currToken) {
            reject({ 
                status: "error",
                message: "Invalid link" 
            });
        }
        await Cart.create({
            id: uuidv4(),
            deletedAt: null,
            status: 1,
            userId
        });
        await User.update(
            { isActived: 1, },
            { where: { id: userId } }
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
});

const userLogin = (username, password) => new Promise(async (resolve, reject) => {
    try {
        const user = !username.includes("@")
            ?   await User.findOne({
                    where: { username: username },
                    attributes: {
                        exclude: ['CartId', 'ConversationId']
                    },
                })
            :   await User.findOne({
                    where: { email: username },
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
                if (!match) resolve({ 
                    status: "error" ,
                    message: "Wrong Username And Password Combination" 
                });
    
                let token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRATION_TEXT,
                });
                let refreshToken = await RefreshToken.createToken("user", user.id);
    
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
});

const staffLogin = (username, password) => new Promise(async (resolve, reject) => {
    try {
        const staff = await AdminStaff.findOne({
            where: { username: username }
        });
        if (!staff) {
            resolve({ 
                status: "error",
                message: "Staff Doesn't Exist!" 
            });
        }
        bcrypt.compare(password, staff.password).then(async (match) => {
            if (!match) reject({ 
                status: "error" ,
                message: "Wrong Username And Password Combination" 
            });

            let token = jwt.sign({ username: staff.username, id: staff.id }, process.env.SECRET_KEY, {
                expiresIn: process.env.JWT_EXPIRATION_TEXT,
            });
            let refreshToken = await RefreshToken.createToken("admin", staff.id);
            await AdminStaff.update(
                { lastLogin: new Date() },
                { where: { id: staff.id } }
            );
            let roles = await getAdminRoleByAdminId(staff.id);

            resolve({
                status: "success",
                message: "Login successfully",
                payload: {
                    staff,
                    accessToken: token,
                    refreshToken: refreshToken,
                    roles: roles.payload
                }
            });
        });
    } catch (error) {
        reject(error);
    }
});

const staffProfile = (Authorization) => new Promise(async (resolve, reject) => {
    try {
        if (!Authorization) {
            reject({ 
                status: "error" ,
                message: "Invalid Authorization token" 
            });
        }
        const accessToken = Authorization.split(' ')[1];
        const { id } = jwt.verify(accessToken, process.env.SECRET_KEY);
        const staff = await AdminStaff.findOne({ where: { id } });
        if (!staff) {
            reject({ 
                status: "error" ,
                message: "Invalid Authorization token" 
            });
        }
        resolve({
            status: "success",
            message: "Get staff profile successfully",
            payload: { staff }
        });
    } catch (error) {
        reject(error);
    }
});

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
    userLogin,
    userRegister,
    confirmMail,

    refreshToken,

    staffRegister,
    staffLogin,
    staffProfile
}