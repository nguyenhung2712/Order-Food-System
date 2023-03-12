const { Message } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getByConverId = (converId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Message.findAll({
            where: { converId }
        });
        resolve({ 
            status: "success",
            message: "Get messages successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (messageId) => new Promise(async (resolve, reject) => {
    try {
        const message = await Message.findOne({
            where: { id: messageId }
        });
        resolve({
            status: "success",
            message: "Get message successfully.",
            payload: message
        });
    } catch (error) {
        reject(error);
    }
});

const createMessage = (userId, adminId, converId, messageBody) => new Promise(async (resolve, reject) => {
    try {
        await Message.create(
            {
                id: uuidv4(),
                ...messageBody,
                deletedAt: null,
                status: 1,
                userId,
                adminId,
                converId
            }
        )
            .then(message => {
                resolve({ 
                    status: "success",
                    message: "Create message successfully.",
                    payload: message
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateMessage = (messageId, messageBody) => new Promise(async (resolve, reject) => {
    try {
        await Message.update(
            { ...messageBody },
            { where: { id: messageId } }
        )
            .then(message => {
                resolve({ 
                    status: "success",
                    message: "Update message successfully.",
                    payload: message
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteMessage = (messageId) => new Promise(async (resolve, reject) => {
    try {
        await Message.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: messageId } }
        )
            .then(message => {
                resolve({ 
                    status: "success",
                    message: "Delete message successfully.",
                    payload: message
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverConver = (messageId) => new Promise(async (resolve, reject) => {
    try {
        await Message.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: messageId } }
        )
            .then(message => {
                resolve({ 
                    status: "success",
                    message: "Recover message successfully.",
                    payload: message
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getById,
    getByConverId,
    createMessage,
    updateMessage,
    deleteMessage,
    recoverConver
}