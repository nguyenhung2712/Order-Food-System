const { Dish, Rate, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getById = (type, id) => new Promise(async (resolve, reject) => {
    try {
        const rates = type === "user"
            ? await Rate.findAll({
                where: { userId: id },
                include: [
                    { model: User, as: "user" },
                    { model: Dish, as: "product" },
                ],
            })
            : await Rate.findAll({
                where: { dishId: id },
                include: [
                    { model: User, as: "user" },
                    { model: Dish, as: "product" },
                ],
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
        await Rate.update(
            { ...rateBody },
            { where: { id: rateId } }
        )
            .then(() => Rate.findByPk(rateId, {
                include: [
                    { model: User, as: "user" },
                    { model: Dish, as: "product" },
                ],
            }))
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
        await Rate.destroy({ where: { id: rateId } })
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

module.exports = {
    getById,
    createRate,
    updateRate,
    deleteRate
}