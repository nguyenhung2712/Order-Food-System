const bcrypt = require("bcrypt");
const { User } = require("../models");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await User.findAll({
            attributes: {
                exclude: ['CartId', 'ConversationId']
            },
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
            attributes: {
                exclude: ['CartId', 'ConversationId']
            },
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

const createUser = ({...body}) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.create({ ...body });
        resolve({ 
            status: "success",
            message: "Create user successfully.",
            payload: user
        });
    } catch (error) {
        reject(error);
    }
});

const changePassword = (userId, newPassword, oldPassword) => new Promise(async (resolve, reject) => {
    try {
        const user = await getUser(userId);
        bcrypt.compare(oldPassword, user.password).then(async (match) => {
            if (!match) {
                reject({ 
                    status: "error",
                    message: "Wrong Password Entered!" 
                });
            }
            bcrypt.hash(newPassword, 10).then(async (hash) => {
                const response = await User.update({ password: hash }, {
                    where: { id: userId }
                });
                resolve({ 
                    status: "success",
                    message: "Change account's password successfully.",
                    payload: response
                });
            });
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getUser,
    createUser,
    changePassword,
}