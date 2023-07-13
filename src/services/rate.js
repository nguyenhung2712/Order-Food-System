const { Dish, Rate, User, Interact, Reason, Archive } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require('sequelize');

const solveSessionId = "3d71db18-fec4-11ed-905b-d8d09055bd1c";

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

const getAllReports = () => new Promise(async (resolve, reject) => {
    try {
        await Interact.findAll({
            where: {
                ratingId: {
                    [Op.not]: null
                },
                type: 2,
                status: {
                    [Op.or]: [2, 1]
                },
            },
            include: [
                { model: User, as: "user" },
                {
                    model: Rate, as: "rating", include: [
                        { model: User, as: "user" }
                    ]
                },
                { model: Reason, as: "reason" },
            ]
        })
            .then(async (reports) => {
                resolve({
                    status: "success",
                    message: "Get All Rating's Interact successfully.",
                    payload: reports
                });
            });
    } catch (error) {
        reject(error);
    }
});

const solveReport = (ratingId, adminId) => new Promise(async (resolve, reject) => {
    try {
        await Rate.update({ status: 2 }, {
            where: { id: ratingId }
        })
            .then(async (res) => {
                await Interact.update({ status: 2 }, {
                    where: { ratingId, type: 2 }
                });
                await Archive.create({
                    typeId: solveSessionId,
                    ratingId,
                    adminId: adminId
                });
                resolve({
                    status: "success",
                    message: "Solve report successfully.",
                    payload: res
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteReport = (reportId) => new Promise(async (resolve, reject) => {
    try {
        await Interact.destroy({
            where: { id: reportId }
        })
            .then(async (res) => {
                resolve({
                    status: "success",
                    message: "Delete report successfully.",
                    payload: res
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
    getAllReports,
    deleteReport,
    solveReport
}