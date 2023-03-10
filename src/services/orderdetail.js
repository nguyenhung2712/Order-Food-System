const { Dish, Order, OrderDetail } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getByOrderId = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await OrderDetail.findAll({
            where: { orderId: orderId }
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
            where: { id: detailId }
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

const createDetail = (dishId, orderId, detailBody) => new Promise(async (resolve, reject) => {
    try {
        const dish = await Dish.findByPk(dishId);
        const order = await Order.findByPk(orderId);
        if (!dish) {
            reject({ 
                status: "error",
                message: "Dish Doesn't Exist!" 
            });
        }
        if (!order) {
            reject({ 
                status: "error",
                message: "Order Doesn't Exist!" 
            });
        }
        await OrderDetail.create(
            { 
                id: uuidv4(),
                ...detailBody,
                deletedAt: new Date(),
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
                status: 1
            },
            { where: { id: detailId } }
        )
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