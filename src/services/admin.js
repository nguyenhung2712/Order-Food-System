const { AdminStaff } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await AdminStaff.findAll();
        resolve({
            status: "success",
            message: "Get staffs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (staffId) => new Promise(async (resolve, reject) => {
    try {
        const staff = await AdminStaff.findOne({
            where: { id: staffId }
        })
        resolve({
            status: "success",
            message: "Get staff successfully.",
            payload: staff
        });
    } catch (error) {
        reject(error);
    }
});

const createStaff = (password, staffBody) => new Promise(async (resolve, reject) => {
    try {
        bcrypt.hash(password, 10).then(async (hash) => {
            await AdminStaff.create(
                {
                    id: uuidv4(),
                    ...staffBody,
                    deletedAt: null,
                    lastLogin: null,
                    status: 1,
                    isActived: 1,
                    password: hash
                }
            )
                .then(staff => {
                    resolve({
                        status: "success",
                        message: "Create staff successfully.",
                        payload: staff
                    });
                });
        });

    } catch (error) {
        reject(error);
    }
});

const updateStaff = (staffId, staffBody) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            {
                ...staffBody,
                disabledAt: staffBody.disabledAt ? new Date() : null
            },
            { where: { id: staffId } }
        )
            .then(() => AdminStaff.findByPk(staffId))
            .then(staff => {
                resolve({
                    status: "success",
                    message: "Update staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteStaff = (staffId) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: staffId } }
        )
            .then(() => AdminStaff.findByPk(staffId))
            .then(staff => {
                resolve({
                    status: "success",
                    message: "Delete staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

const removeStaff = (staffId) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.destroy({ where: { id: staffId } })
            .then(staff => {
                resolve({
                    status: "success",
                    message: "Delete staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverStaff = (staffId) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: staffId } }
        )
            .then(() => AdminStaff.findByPk(staffId))
            .then(staff => {
                resolve({
                    status: "success",
                    message: "Recover staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

const approveStaff = (staffId) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            { isActived: 1 },
            { where: { id: staffId } }
        )
            .then(() => AdminStaff.findByPk(staffId))
            .then(async (staff) => {
                await sendEmail(staff.email, "Registration Approved", '', `<!DOCTYPE html>
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
                                                <td style="padding: 30px 30px 20px">
                                                    <p
                                                        style="text-align:center; font-size: 28px; font-weight: bold;padding-top: 12px; margin-bottom: 24px;">
                                                        Registration approved</p>
                                                    <p style="margin-bottom: 10px;">Hi ${staff.fullname},</p>
                                                    <p style="margin-bottom: 10px;">We are pleased to have you as a member of ....</p>
                                                    <p style="margin-bottom: 10px;">Your account has been verified and you can access
                                                        our management system.</p>
                                                    <p style="margin-bottom: 15px;">Hope you'll enjoy the experience, we're here if you
                                                        have any questions, drop us a line at <a
                                                            style="color: #6576ff; text-decoration:none;"
                                                            href="mailto:hung.n.61cnttclc@ntu.edu.vn">hung.n.61cnttclc@ntu.edu.vn</a>
                                                        anytime. </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style="width:100%;max-width:620px;margin:0 auto;">
                                        <tbody>
                                            <tr>
                                                <td style="text-align: center; padding:25px 20px 0;">
                                                    <p style="padding-top: 15px; font-size: 12px;">This email was sent to you as a
                                                        registered user of <a style="color: #6576ff; text-decoration:none;"
                                                            href="https://softnio.com">softnio.com</a>.
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
                    message: "Recover staff successfully.",
                    payload: staff
                });
            });

    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createStaff,
    updateStaff,
    deleteStaff,
    recoverStaff,
    removeStaff,
    approveStaff
}