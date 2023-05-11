const bcrypt = require("bcrypt");
const { User, UserAddress, Address, Province, District, Ward } = require("../models");

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
        const { password, ...body } = userBody;
        if (!password) {
            await User.update({ ...body }, {
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

module.exports = {
    getAll,
    getUser,
    createUser,
    changePassword,
    updateUser
}