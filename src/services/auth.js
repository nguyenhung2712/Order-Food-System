const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const otp = require("../utils/generateStr");

require("dotenv").config();
const { User, Token, RefreshToken, Cart, AdminStaff } = require("../models");
const sendEmail = require("../utils/sendEmail");
const { getAdminRoleByAdminId } = require("./role");

const userRegister = ({ ...reqBody }) => new Promise(async (resolve, reject) => {
    try {
        const { password, ...body } = reqBody;
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
                isActived: 0,
                is2FA: 0,
                status: 1,
                avatar: "https://res.cloudinary.com/duijwi8od/image/upload/v1680861867/DATN_Images_Project/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg",
            })
                .then(async (user) => {
                    let otpCode = otp.generateOTP();
                    await Token.createToken(user, otpCode)
                        .then(async (token) => {
                            let { password, ...res } = user.dataValues;
                            await sendEmail(user.email, "OTP code", '', `<!DOCTYPE html>
                            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                                xmlns:o="urn:schemas-microsoft-com:office:office">
                            
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="x-apple-disable-message-reformatting">
                                <title></title>
                            
                                <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                            
                                <style>
                                    html,
                                    body {
                                        margin: 0 auto !important;
                                        padding: 0 !important;
                                        height: 100% !important;
                                        width: 100% !important;
                                        font-family: 'Roboto', sans-serif !important;
                                        font-size: 14px;
                                        margin-bottom: 10px;
                                        line-height: 24px;
                                        color: #8094ae;
                                        font-weight: 400;
                                    }
                            
                                    * {
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                        margin: 0;
                                        padding: 0;
                                    }
                            
                                    table,
                                    td {
                                        mso-table-lspace: 0pt !important;
                                        mso-table-rspace: 0pt !important;
                                    }
                            
                                    table {
                                        border-spacing: 0 !important;
                                        border-collapse: collapse !important;
                                        table-layout: fixed !important;
                                        margin: 0 auto !important;
                                    }
                            
                                    table table table {
                                        table-layout: auto;
                                    }
                            
                                    a {
                                        text-decoration: none;
                                    }
                            
                                    img {
                                        -ms-interpolation-mode: bicubic;
                                    }
                                </style>
                            
                            </head>
                            
                            <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                                <center style="width: 100%; background-color: #f5f6fa;">
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                                        <tr>
                                            <td style="padding: 40px 0;">
                                                <table style="width:100%;max-width:620px;margin:0 auto;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="text-align: center; padding-bottom:25px">
                                                                <a href="#"><img style="height: 40px" src="images/logo-dark2x.png" alt="logo"></a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="text-align:center;padding: 50px 30px;">
                                                                <p
                                                                    style="font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                                    OTP Code</p>
                                                                <h2 style="font-size: 18px; color: #6576ff; font-weight: 400; margin-bottom: 8px;">
                                                                    <span style="margin:0;
                                                                    padding:0;
                                                                    border:none;
                                                                    border-spacing:0;
                                                                    line-height:100%;
                                                                    text-align:center;
                                                                    font-size:48px;
                                                                    line-height:100%;
                                                                    text-transform:uppercase;
                                                                    letter-spacing:0.7em;
                                                                    border-collapse:collapse;
                                                                    font-family:inherit">${otpCode}</span>
                                                                </h2>
                                                                <p>If you are not the sender of this code, change your account password immediately
                                                                    to avoid unauthorized access.</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </center>
                            </body>
                            
                            </html>`);
                            resolve({
                                status: "success",
                                message: "Đăng ký thành công. Yêu cầu xác nhận tài khoản bằng OTP code đã được gửi.",
                                payload: res
                            });
                        });
                });
        });
    } catch (error) {
        reject(error);
    }
});

const staffRegister = ({ ...reqBody }) => new Promise(async (resolve, reject) => {
    try {
        const { password, ...body } = reqBody;
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
                message: "Mã OTP không tồn tại"
            });
        }
        await Cart.create({
            id: uuidv4(),
            deletedAt: null,
            status: 1,
            userId
        });

        /* await Token.destroy({ where: { token } }); */
        await User.update(
            { isActived: 1, },
            { where: { id: userId } }
        )
            .then(async () => await User.findByPk(userId))
            .then(async (user) => {
                await sendEmail(user.email, "Verification Successful", '', `<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                
                
                    <style>
                        html,
                        body {
                            margin: 0 auto !important;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            font-family: 'Roboto', sans-serif !important;
                            font-size: 14px;
                            margin-bottom: 10px;
                            line-height: 24px;
                            color: #8094ae;
                            font-weight: 400;
                        }
                
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            margin: 0;
                            padding: 0;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                
                        table {
                            border-spacing: 0 !important;
                            border-collapse: collapse !important;
                            table-layout: fixed !important;
                            margin: 0 auto !important;
                        }
                
                        table table table {
                            table-layout: auto;
                        }
                
                        a {
                            text-decoration: none;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                    </style>
                
                </head>
                
                <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                    <center style="width: 100%; background-color: #f5f6fa;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                            <tr>
                                <td style="padding: 40px 0;">
                                    <table style="width:100%;max-width:620px;margin:0 auto;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center; padding-bottom:25px">
                                                    <a href="#"><img style="height: 40px" src="logo" alt="logo"></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align:center;padding: 50px 30px;">
                                                    <img style="width:88px; margin-bottom:24px;"
                                                        src="https://cdn-icons-png.flaticon.com/512/148/148767.png" alt="Verified">
                                                    <h2 style="font-size: 18px; color: #1ee0ac; font-weight: 400; margin-bottom: 8px;">
                                                        Your Account Verified.</h2>
                
                                                    <div style="text-align:left">
                                                        <p style="padding:14px 0">
                                                            Your account has been verified and you can buy our products. Alternatively,
                                                            you
                                                            can post your blog to share your experience with other users.
                                                        </p>
                                                        <p style="margin-bottom: 15px;">Hope you'll enjoy the experience, we're here if
                                                            you
                                                            have any questions, drop us a line at <a
                                                                style="color: #6576ff; text-decoration:none;"
                                                                href="mailto:hung.n.61cnttclc@ntu.edu.vn">hung.n.61cnttclc@ntu.edu.vn</a>
                                                            anytime. </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
                
                </html>`);
                resolve({
                    status: "success",
                    message: "Xác nhận email thành công",
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
            ? await User.findOne({
                where: { username: username }
            })
            : await User.findOne({
                where: { email: username }
            });
        if (!user) {
            reject({
                status: "error-e",
                message: "Người dùng không tồn tại."
            });
        }
        bcrypt.compare(password, user.password).then(async (match) => {
            if (!match) reject({
                status: "error-p",
                message: "Mật khẩu không chính xác."
            });
            if (user.isActived === 1) {
                if (user.is2FA === 1) {
                    let otpCode = otp.generateOTP();
                    await Token.createToken(user, otpCode)
                        .then(async (token) => {
                            await sendEmail(user.email, "OTP Code", '', `<!DOCTYPE html>
                            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                                xmlns:o="urn:schemas-microsoft-com:office:office">
                            
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="x-apple-disable-message-reformatting">
                                <title></title>
                            
                                <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                            
                                <style>
                                    html,
                                    body {
                                        margin: 0 auto !important;
                                        padding: 0 !important;
                                        height: 100% !important;
                                        width: 100% !important;
                                        font-family: 'Roboto', sans-serif !important;
                                        font-size: 14px;
                                        margin-bottom: 10px;
                                        line-height: 24px;
                                        color: #8094ae;
                                        font-weight: 400;
                                    }
                            
                                    * {
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                        margin: 0;
                                        padding: 0;
                                    }
                            
                                    table,
                                    td {
                                        mso-table-lspace: 0pt !important;
                                        mso-table-rspace: 0pt !important;
                                    }
                            
                                    table {
                                        border-spacing: 0 !important;
                                        border-collapse: collapse !important;
                                        table-layout: fixed !important;
                                        margin: 0 auto !important;
                                    }
                            
                                    table table table {
                                        table-layout: auto;
                                    }
                            
                                    a {
                                        text-decoration: none;
                                    }
                            
                                    img {
                                        -ms-interpolation-mode: bicubic;
                                    }
                                </style>
                            
                            </head>
                            
                            <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                                <center style="width: 100%; background-color: #f5f6fa;">
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                                        <tr>
                                            <td style="padding: 40px 0;">
                                                <table style="width:100%;max-width:620px;margin:0 auto;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="text-align: center; padding-bottom:25px">
                                                                <a href="#"><img style="height: 40px" src="images/logo-dark2x.png" alt="logo"></a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="text-align:center;padding: 50px 30px;">
                                                                <p
                                                                    style="font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                                    OTP Code</p>
                                                                <h2 style="font-size: 18px; color: #6576ff; font-weight: 400; margin-bottom: 8px;">
                                                                    <span style="margin:0;
                                                                    padding:0;
                                                                    border:none;
                                                                    border-spacing:0;
                                                                    line-height:100%;
                                                                    text-align:center;
                                                                    font-size:48px;
                                                                    line-height:100%;
                                                                    text-transform:uppercase;
                                                                    letter-spacing:0.7em;
                                                                    border-collapse:collapse;
                                                                    font-family:inherit">${otpCode}</span>
                                                                </h2>
                                                                <p>If you are not the sender of this code, change your account password immediately
                                                                    to avoid unauthorized access.</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </center>
                            </body>
                            
                            </html>`);
                            resolve({
                                status: "pending",
                                message: "Hãy kiểm tra mail để nhận mã otp.",
                                email: user.email
                            });
                        });
                } else {
                    let token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY, {
                        expiresIn: process.env.JWT_EXPIRATION_TEXT,
                    });
                    let refreshToken = await RefreshToken.createToken("user", user.id);
                    await User.update(
                        { lastLogin: new Date() },
                        { where: { id: staff.id } }
                    );
                    resolve({
                        status: "success",
                        message: "Đăng nhập thành công.",
                        payload: {
                            user,
                            accessToken: token,
                            refreshToken: refreshToken
                        }
                    });
                }
            } else {
                let otpCode = otp.generateOTP();
                await Token.createToken(user, otpCode)
                    .then(async (token) => {
                        await sendEmail(user.email, "OTP Code", '', `<!DOCTYPE html>
                        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                            xmlns:o="urn:schemas-microsoft-com:office:office">
                        
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="x-apple-disable-message-reformatting">
                            <title></title>
                        
                            <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                        
                            <style>
                                html,
                                body {
                                    margin: 0 auto !important;
                                    padding: 0 !important;
                                    height: 100% !important;
                                    width: 100% !important;
                                    font-family: 'Roboto', sans-serif !important;
                                    font-size: 14px;
                                    margin-bottom: 10px;
                                    line-height: 24px;
                                    color: #8094ae;
                                    font-weight: 400;
                                }
                        
                                * {
                                    -ms-text-size-adjust: 100%;
                                    -webkit-text-size-adjust: 100%;
                                    margin: 0;
                                    padding: 0;
                                }
                        
                                table,
                                td {
                                    mso-table-lspace: 0pt !important;
                                    mso-table-rspace: 0pt !important;
                                }
                        
                                table {
                                    border-spacing: 0 !important;
                                    border-collapse: collapse !important;
                                    table-layout: fixed !important;
                                    margin: 0 auto !important;
                                }
                        
                                table table table {
                                    table-layout: auto;
                                }
                        
                                a {
                                    text-decoration: none;
                                }
                        
                                img {
                                    -ms-interpolation-mode: bicubic;
                                }
                            </style>
                        
                        </head>
                        
                        <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                            <center style="width: 100%; background-color: #f5f6fa;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                                    <tr>
                                        <td style="padding: 40px 0;">
                                            <table style="width:100%;max-width:620px;margin:0 auto;">
                                                <tbody>
                                                    <tr>
                                                        <td style="text-align: center; padding-bottom:25px">
                                                            <a href="#"><img style="height: 40px" src="images/logo-dark2x.png" alt="logo"></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                                <tbody>
                                                    <tr>
                                                        <td style="text-align:center;padding: 50px 30px;">
                                                            <p
                                                                style="font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                                OTP Code</p>
                                                            <h2 style="font-size: 18px; color: #6576ff; font-weight: 400; margin-bottom: 8px;">
                                                                <span style="margin:0;
                                                                padding:0;
                                                                border:none;
                                                                border-spacing:0;
                                                                line-height:100%;
                                                                text-align:center;
                                                                font-size:48px;
                                                                line-height:100%;
                                                                text-transform:uppercase;
                                                                letter-spacing:0.7em;
                                                                border-collapse:collapse;
                                                                font-family:inherit">${otpCode}</span>
                                                            </h2>
                                                            <p>If you are not the sender of this code, change your account password immediately
                                                                to avoid unauthorized access.</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </center>
                        </body>
                        
                        </html>`);
                        resolve({
                            status: "pending",
                            message: "Tài khoản chưa kích hoạt. Hãy vào email để nhận mã OTP kích hoạt tài khoản."
                        });
                    });
            }
        });
    } catch (error) {
        reject(error);
    }
});

const userLoginVerifyOTP = ({ otp, username, password }) => new Promise(async (resolve, reject) => {
    try {
        const user = !username.includes("@")
            ? await User.findOne({
                where: { username: username }
            })
            : await User.findOne({
                where: { email: username }
            });

        let curOTP = await Token.findOne({
            where: { userId: user.id, token: `${otp}` }
        });

        if (!curOTP) {
            reject({
                status: "error-null",
                message: "Mã OTP không tồn tại"
            });
        } else if (curOTP) {
            if ((new Date()).getTime() > curOTP.expiredAt.getTime()) {
                await Token.destroy({ where: { id: curOTP.id } });
                reject({
                    status: "error-expired",
                    message: "Mã OTP đã hết hạn."
                });
            }
            bcrypt.compare(password, user.password).then(async (match) => {
                if (!match) reject({
                    status: "error-p",
                    message: "Mật khẩu không chính xác."
                });
                let token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRATION_TEXT,
                });
                let refreshToken = await RefreshToken.createToken("user", user.id);
                await Token.destroy({ where: { id: curOTP.id } });
                await User.update(
                    { lastLogin: new Date() },
                    { where: { id: staff.id } }
                );
                resolve({
                    status: "success",
                    message: "Đăng nhập thành công.",
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

const userFPVerifyOTP = ({ otp, email }) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { email: email }
        });

        let curOTP = await Token.findOne({
            where: { userId: user.id, token: `${otp}` }
        });

        if (!curOTP) {
            reject({
                status: "error-null",
                message: "Mã OTP không tồn tại"
            });
        } else if (curOTP) {

            if ((new Date()).getTime() > curOTP.expiredAt.getTime()) {
                await Token.destroy({ where: { id: curOTP.id } });
                reject({
                    status: "error-expired",
                    message: "Mã OTP đã hết hạn."
                });
            }

            await Token.destroy({ where: { id: curOTP.id } });
            resolve({
                status: "success",
                message: "Mã OTP hợp lệ.",
                payload: user
            });
        }
    } catch (error) {
        reject(error);
    }
});

const sendOTP = ({ username }) => new Promise(async (resolve, reject) => {
    try {
        const user = !username.includes("@")
            ? await User.findOne({
                where: { username: username }
            })
            : await User.findOne({
                where: { email: username }
            });
        let otpCode = otp.generateOTP();
        await Token.createToken(user, otpCode)
            .then(async (token) => {
                await sendEmail(user.email, "OTP Code", '', `<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                
                    <style>
                        html,
                        body {
                            margin: 0 auto !important;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            font-family: 'Roboto', sans-serif !important;
                            font-size: 14px;
                            margin-bottom: 10px;
                            line-height: 24px;
                            color: #8094ae;
                            font-weight: 400;
                        }
                
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            margin: 0;
                            padding: 0;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                
                        table {
                            border-spacing: 0 !important;
                            border-collapse: collapse !important;
                            table-layout: fixed !important;
                            margin: 0 auto !important;
                        }
                
                        table table table {
                            table-layout: auto;
                        }
                
                        a {
                            text-decoration: none;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                    </style>
                
                </head>
                
                <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                    <center style="width: 100%; background-color: #f5f6fa;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                            <tr>
                                <td style="padding: 40px 0;">
                                    <table style="width:100%;max-width:620px;margin:0 auto;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center; padding-bottom:25px">
                                                    <a href="#"><img style="height: 40px" src="images/logo-dark2x.png" alt="logo"></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align:center;padding: 50px 30px;">
                                                    <p
                                                        style="font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                        OTP Code</p>
                                                    <h2 style="font-size: 18px; color: #6576ff; font-weight: 400; margin-bottom: 8px;">
                                                        <span style="margin:0;
                                                        padding:0;
                                                        border:none;
                                                        border-spacing:0;
                                                        line-height:100%;
                                                        text-align:center;
                                                        font-size:48px;
                                                        line-height:100%;
                                                        text-transform:uppercase;
                                                        letter-spacing:0.7em;
                                                        border-collapse:collapse;
                                                        font-family:inherit">${otpCode}</span>
                                                    </h2>
                                                    <p>If you are not the sender of this code, change your account password immediately
                                                        to avoid unauthorized access.</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
                
                </html>`);
                resolve({
                    status: "success",
                    message: "Đã gửi mã OTP đến email của bạn."
                });
            });
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
                message: "Nhân viên không tồn tại."
            });
        }
        bcrypt.compare(password, staff.password).then(async (match) => {
            if (!match) reject({
                status: "error-p",
                message: "Mật khẩu không chính xác."
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
                status: "error",
                message: "Token xác thực không hợp lệ"
            });
        }
        const accessToken = Authorization.split(' ')[1];
        const { id } = jwt.verify(accessToken, process.env.SECRET_KEY);
        const staff = await AdminStaff.findOne({ where: { id } });
        if (!staff) {
            reject({
                status: "error",
                message: "Token xác thực không hợp lệ"
            });
        }
        resolve({
            status: "success",
            message: "Lấy ra nhân viên thành công.",
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
        let refreshToken = await RefreshToken.findOne({
            where: { token: requestToken },
            include: [
                { model: User, as: "user" },
                { model: AdminStaff, as: "admin" }
            ]
        });
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

        let user = refreshToken.user;
        if (!user) {
            user = refreshToken.admin;
        }
        let newAccessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRATION_TEXT,
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

const forgetPassword = ({ email }) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { email }
        });
        if (!user) {
            reject({
                status: "error",
                message: "Email của bạn không tồn tại trong hệ thống."
            });
        }
        let otpCode = otp.generateOTP();
        await Token.createToken(user, otpCode)
            .then(async (token) => {
                await sendEmail(email, "OTP Code", '', `<!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <title></title>
                
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css">
                
                    <style>
                        html,
                        body {
                            margin: 0 auto !important;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            font-family: 'Roboto', sans-serif !important;
                            font-size: 14px;
                            margin-bottom: 10px;
                            line-height: 24px;
                            color: #8094ae;
                            font-weight: 400;
                        }
                
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            margin: 0;
                            padding: 0;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                
                        table {
                            border-spacing: 0 !important;
                            border-collapse: collapse !important;
                            table-layout: fixed !important;
                            margin: 0 auto !important;
                        }
                
                        table table table {
                            table-layout: auto;
                        }
                
                        a {
                            text-decoration: none;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                    </style>
                
                </head>
                
                <body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f5f6fa;">
                    <center style="width: 100%; background-color: #f5f6fa;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f5f6fa">
                            <tr>
                                <td style="padding: 40px 0;">
                                    <table style="width:100%;max-width:620px;margin:0 auto;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center; padding-bottom:25px">
                                                    <a href="#"><img style="height: 40px" src="images/logo-dark2x.png" alt="logo"></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align:center;padding: 50px 30px;">
                                                    <p
                                                        style="font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                        OTP Code</p>
                                                    <h2 style="font-size: 18px; color: #6576ff; font-weight: 400; margin-bottom: 8px;">
                                                        <span style="margin:0;
                                                        padding:0;
                                                        border:none;
                                                        border-spacing:0;
                                                        line-height:100%;
                                                        text-align:center;
                                                        font-size:48px;
                                                        line-height:100%;
                                                        text-transform:uppercase;
                                                        letter-spacing:0.7em;
                                                        border-collapse:collapse;
                                                        font-family:inherit">${otpCode}</span>
                                                    </h2>
                                                    <p>If you are not the sender of this code, change your account password immediately
                                                        to avoid unauthorized access.</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
                
                </html>`);
                resolve({
                    status: "success",
                    message: "Đã gửi mã OTP đến email của bạn."
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    userLogin,
    userRegister,
    confirmMail,
    userLoginVerifyOTP,
    userFPVerifyOTP,
    sendOTP,
    forgetPassword,
    refreshToken,

    staffRegister,
    staffLogin,
    staffProfile
}