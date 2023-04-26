const { Dish, Order, OrderDetail } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getByOrderId = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await OrderDetail.findAll({
            where: { orderId: orderId },
            include: [
                { model: Order, as: "order" },
                { model: Dish, as: "dish" }
            ],
        });
        resolve({
            status: "success",
            message: "Get order items successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (detailId) => new Promise(async (resolve, reject) => {
    try {
        const detail = await OrderDetail.findOne({
            where: { id: detailId },
            include: [
                { model: Order, as: "order" },
                { model: Dish, as: "dish" }
            ],
        });
        resolve({
            status: "success",
            message: "Get Order item successfully.",
            payload: detail
        });
    } catch (error) {
        reject(error);
    }
});

const createDetail = (detailBody) => new Promise(async (resolve, reject) => {
    try {
        await OrderDetail.create(
            {
                id: uuidv4(),
                ...detailBody,
                deletedAt: null,
                status: 1
            }
        )
            .then(detail => {
                resolve({
                    status: "success",
                    message: "Create Order item successfully.",
                    payload: detail
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateDetail = (detailId, detailBody) => new Promise(async (resolve, reject) => {
    try {
        await OrderDetail.update(
            { ...detailBody },
            { where: { id: detailId } }
        )
            .then(() => OrderDetail.findByPk(detailId, {
                include: [
                    { model: Order, as: "order" },
                    { model: Dish, as: "dish" }
                ],
            }))
            .then(detail => {
                resolve({
                    status: "success",
                    message: "Update Order item successfully.",
                    payload: detail
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteDetail = (detailId) => new Promise(async (resolve, reject) => {
    try {
        await OrderDetail.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: detailId } }
        )
            .then(() => OrderDetail.findByPk(detailId, {
                include: [
                    { model: Order, as: "order" },
                    { model: Dish, as: "dish" }
                ],
            }))
            .then(detail => {
                resolve({
                    status: "success",
                    message: "Delete Order item successfully.",
                    payload: detail
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverDetail = (detailId) => new Promise(async (resolve, reject) => {
    try {
        await OrderDetail.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: detailId } }
        )
            .then(() => OrderDetail.findByPk(detailId, {
                include: [
                    { model: Order, as: "order" },
                    { model: Dish, as: "dish" }
                ],
            }))
            .then(detail => {
                resolve({
                    status: "success",
                    message: "Recover Order item successfully.",
                    payload: detail
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getByOrderId,
    getById,
    createDetail,
    updateDetail,
    deleteDetail,
    recoverDetail
}