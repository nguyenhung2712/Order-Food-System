const bcrypt = require("bcrypt");
const { User, UserAddress, Address, Province, District, Ward, Cart, Order, OrderDetail } = require("../models");
const password = require("../utils/generateStr");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserAddress,
                    include: [
                        {
                            model: Address, as: "address",
                            include: [
                                { model: Province, as: "province" },
                                { model: District, as: "district" },
                                { model: Ward, as: "ward" },
                            ]
                        }
                    ]
                }
            ]
        });
        if (!response || response.length === 0) {
            reject({
                status: "error",
                message: "Doesn't Exist!"
            });
        } else {
            resolve({
                status: "success",
                message: "Get users successfully.",
                payload: response
            });
        }
    } catch (error) {
        reject(error);
    }
});

const getUser = (userId) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserAddress,
                    include: [
                        {
                            model: Address, as: "address",
                            include: [
                                { model: Province, as: "province" },
                                { model: District, as: "district" },
                                { model: Ward, as: "ward" },
                            ]
                        }
                    ]
                }
            ]
        });
        if (!user) {
            reject({
                status: "error",
                message: "User Doesn't Exist!"
            });
        } else {
            resolve({
                status: "success",
                message: "Get user successfully.",
                payload: user
            });
        }
    } catch (error) {
        reject(error);
    }
});

const getUserByEmail = (body) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { email: body.email },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: UserAddress,
                    include: [
                        {
                            model: Address, as: "address",
                            include: [
                                { model: Province, as: "province" },
                                { model: District, as: "district" },
                                { model: Ward, as: "ward" },
                            ]
                        }
                    ]
                },
                { model: Cart }
            ]
        });
        if (!user) {
            let pw = password.generatePW();
            bcrypt.hash(pw, 10).then(async (hash) => {
                await User.create({
                    id: uuidv4(), password: hash,
                    lastLogin: new Date(),
                    status: 1,
                    isShared: 0,
                    ...body
                })
                    .then(async (res) => {
                        await sendEmail(
                            res.email,
                            "Mật khẩu đăng nhập",
                            `Đây là mật khẩu đăng nhập dành cho phiên đăng nhập sau của bạn: ${pw}`
                        );
                        await Cart.create({
                            id: uuidv4(),
                            deletedAt: null,
                            status: 1,
                            userId: res.id
                        });
                        return await User.findOne({ where: { id: res.id } }, {
                            include: [
                                {
                                    model: UserAddress,
                                    include: [
                                        {
                                            model: Address, as: "address",
                                            include: [
                                                { model: Province, as: "province" },
                                                { model: District, as: "district" },
                                                { model: Ward, as: "ward" },
                                            ]
                                        }
                                    ]
                                },
                                { model: Cart }
                            ]
                        })
                    })
                    .then(res => {
                        resolve({
                            status: "success",
                            message: "Get user successfully.",
                            payload: res
                        });
                    })
            });
        } else {
            resolve({
                status: "success",
                message: "Get user successfully.",
                payload: user
            });
        }
    } catch (error) {
        reject(error);
    }
});

const createUser = (userBody) => new Promise(async (resolve, reject) => {
    try {
        const { password, ...body } = userBody;
        bcrypt.hash(password, 10).then(async (hash) => {
            const user = await User.create(
                { ...body }
            );
            resolve({
                status: "success",
                message: "Create user successfully.",
                payload: user
            });
        });
    } catch (error) {
        reject(error);
    }
});

const updateUser = (userId, userBody) => new Promise(async (resolve, reject) => {
    try {
        const { password, username, email, ...body } = userBody;
        const user = await User.findByPk(userId);
        if (!password) {
            await User.update(
                {
                    ...body,
                    username: username ? username : user.username,
                    email: email ? email : user.email
                }
                , {
                    where: { id: userId }
                })
                .then(async () => await User.findByPk(userId, {
                    attributes: { exclude: ['password'] },
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                }))
                .then(user => {
                    resolve({
                        status: "success",
                        message: "Change user profile successfully.",
                        payload: user
                    });
                });
        } else {
            bcrypt.hash(password, 10).then(async (hash) => {
                await User.update({ ...body, password }, {
                    where: { id: userId }
                })
                    .then(async () => await User.findByPk(userId, {
                        attributes: { exclude: ['password'] },
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }))
                    .then(user => {
                        resolve({
                            status: "success",
                            message: "Change user profile successfully.",
                            payload: user
                        });
                    });
            })
        }
    } catch (error) {
        reject(error);
    }
});

const changePassword = (userId, newPassword, oldPassword) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({
            where: { id: userId }
        });
        if (!oldPassword) {
            bcrypt.hash(newPassword, 10).then(async (hash) => {
                await User.update({ password: hash }, {
                    where: { id: userId }
                });
                resolve({
                    status: "success",
                    message: "Thay đổi mật khẩu tài khoản thành công."
                });
            });
        } else {
            bcrypt.compare(oldPassword, user.password).then(async (match) => {
                if (!match) {
                    reject({
                        status: "error",
                        message: "Mật khẩu cũ không chính xác!"
                    });
                }
                bcrypt.hash(newPassword, 10).then(async (hash) => {
                    await User.update({ password: hash }, {
                        where: { id: userId }
                    });
                    resolve({
                        status: "success",
                        message: "Thay đổi mật khẩu tài khoản thành công."
                    });
                });
            });
        }
    } catch (error) {
        reject(error);
    }
});

const sendWarningMail = (userId) => new Promise(async (resolve, reject) => {
    try {
        await User.findOne({
            where: { id: userId }
        })
            .then(async (user) => {
                await sendEmail(
                    user.email,
                    "Cảnh cáo vi phạm",
                    `Một trong những hoạt động của bạn đã vi phạm điều lệ của hệ thống chúng tôi.`
                );
                resolve({
                    status: "success",
                    message: "Thay đổi mật khẩu tài khoản thành công."
                });
            })

    } catch (error) {
        reject(error);
    }
});

const sendRestoreMail = (userId) => new Promise(async (resolve, reject) => {
    try {
        let pw = password.generatePW();
        bcrypt.hash(pw, 10).then(async (hash) => {
            await User.update({ password: hash }, {
                where: { id: userId },
            })
                .then(async () => await User.findByPk(userId))
                .then(async (user) => {
                    await sendEmail(
                        user.email,
                        "Khôi phục tài khoản",
                        `Đây là tài khoản và mật khẩu mới của bạn: ${user.username} ${user.password}`
                    );
                    resolve({
                        status: "success",
                        message: "Send Restoring mail successfully."
                    });
                })

        })
    } catch (error) {
        reject(error);
    }
});

const sendNewestOrder = (userId) => new Promise(async (resolve, reject) => {
    try {
        await Order.findOne({
            where: { userId },
            include: [
                { model: User, as: "user" },
                { model: OrderDetail }
            ],
            order: [['createdAt', 'DESC']]
        })
            .then(async (res) => {
                await sendEmail(
                    res.user.email,
                    "Hóa đơn mới nhất",
                    `Đây là ...`
                );
                resolve({
                    status: "success",
                    message: "Send Newest Order successfully."
                });
            })
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getUser,
    getUserByEmail,
    createUser,
    changePassword,
    updateUser,
    sendWarningMail,
    sendRestoreMail,
    sendNewestOrder
}