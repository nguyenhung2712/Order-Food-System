const { Dish, Rate, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getById = (type, id) => new Promise(async (resolve, reject) => {
    try {
        const rates = type === "user" 
            ? await Rate.findAll({
                where: { userId: id }
            })
            : await Rate.findAll({
                where: { dishId: id }
            });
            resolve({ 
                status: "success",
                message: "Get rates successfully.",
                payload: rates
            });
    } catch (error) {
        reject(error);
    }
});

const createRate = (userId, dishId, rateBody) => new Promise(async (resolve, reject) => {
    try {
        await Rate.create({
            id: uuidv4(),
            ...rateBody,
            userId,
            dishId,
            deletedAt: new Date(),
            status: 1
        })
            .then(rate => {
                resolve({ 
                    status: "success",
                    message: "Create rate successfully.",
                    payload: rate
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateRate = (rateId, rateBody) => new Promise(async (resolve, reject) => {
    try {
        const rate = await Rate.findOne({
            where: { id: rateId }
        });
        if (!rate) {
            reject({ 
                status: "error",
                message: "This Rate Doesn't Exist!" 
            });
        }
        await Rate.update(
            { ...rateBody },
            { where: { id: rateId } }
        )
            .then(rate => {
                resolve({ 
                    status: "success",
                    message: "Update rate successfully.",
                    payload: rate
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteRate = (rateId) => new Promise(async (resolve, reject) => {
    try {
        const rate = await Rate.findOne({
            where: { id: rateId }
        });
        if (!rate) {
            reject({ 
                status: "error",
                message: "Rate Doesn't Exist!" 
            });
        }

        await Rate.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: rateId } }
        )
            .then(rate => {
                resolve({ 
                    status: "success",
                    message: "Delete rate successfully.",
                    payload: rate
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverRate = (rateId) => new Promise(async (resolve, reject) => {
    try {
        const rate = await Rate.findOne({
            where: { id: rateId }
        });
        if (!rate) {
            reject({ 
                status: "error",
                message: "Rate Doesn't Exist!" 
            });
        }

        await Rate.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: rateId } }
        )
            .then(rate => {
                resolve({ 
                    status: "success",
                    message: "Recover rate successfully.",
                    payload: rate
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getById,
    createRate,
    updateRate,
    deleteRate,
    recoverRate
}