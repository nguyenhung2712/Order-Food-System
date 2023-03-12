const { Notification } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Notification.findAll();
        resolve({
            status: "success",
            message: "Get comments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByReceiverId = (receiverId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Notification.findAll({
            where: { receiverId }
        });
        resolve({ 
            status: "success",
            message: "Get comments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (notifyId) => new Promise(async (resolve, reject) => {
    try {
        const notification = await Notification.findOne({
            where: { id: notifyId }
        });
        resolve({
            status: "success",
            message: "Get notification successfully.",
            payload: notification
        });
    } catch (error) {
        reject(error);
    }
});

const createNotif = (receiverId, notifBody) => new Promise(async (resolve, reject) => {
    try {
        await Notification.create(
            {
                id: uuidv4(),
                ...notifBody,
                deletedAt: null,
                status: 1,
                receiverId,
                blogId
            }
        )
            .then(notif => {
                resolve({ 
                    status: "success",
                    message: "Create notification successfully.",
                    payload: notif
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateNotif = (notifyId, notifBody) => new Promise(async (resolve, reject) => {
    try {
        await Notification.update(
            { ...notifBody },
            { where: { id: notifyId } }
        )
            .then(notif => {
                resolve({ 
                    status: "success",
                    message: "Update notification successfully.",
                    payload: notif
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteNotif = (notifId) => new Promise(async (resolve, reject) => {
    try {
        await Notification.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: notifId } }
        )
            .then(notif => {
                resolve({ 
                    status: "success",
                    message: "Delete notification successfully.",
                    payload: notif
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverNotif = (notifId) => new Promise(async (resolve, reject) => {
    try {
        await Notification.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: notifId } }
        )
            .then(notif => {
                resolve({ 
                    status: "success",
                    message: "Recover notification successfully.",
                    payload: notif
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByReceiverId,
    createNotif,
    updateNotif,
    deleteNotif,
    recoverNotif
}