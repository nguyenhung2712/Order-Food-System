const { Order, Payment, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Order.findAll();
        resolve({ 
            status: "success",
            message: "Get orders successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId }
        });
        resolve({ 
            status: "success",
            message: "Get order successfully.",
            payload: order
        });
    } catch (error) {
        reject(error);
    }
});

const createOrder = (userId, paymentBody, orderBody) => new Promise(async (resolve, reject) => {
    try {
        await Payment.create({
            id: uuidv4(),
            ...paymentBody,
            deletedAt: null,
            status: 1,
            predictDate: null,
            userId: userId
        })
            .then(async (payment) => {
                await Order.create({
                    id: uuidv4(),
                    ...orderBody,
                    paymentId: payment.id
                })
                    .then(order => {
                        resolve({ 
                            status: "success",
                            message: "Create order successfully.",
                            payload: order
                        });
                    });
            });
    } catch (error) {
        reject(error);
    }
});

const updateOrder = (orderId, orderBody) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            { ...orderBody },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId))
            .then(order => {
                resolve({ 
                    status: "success",
                    message: "Update order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteOrder = (orderId) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId))
            .then(order => {
                resolve({ 
                    status: "success",
                    message: "Delete order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverOrder = (orderId) => new Promise(async (resolve, reject) => {
    try {
        await Order.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: orderId } }
        )
            .then(() => Order.findByPk(orderId))
            .then(order => {
                resolve({ 
                    status: "success",
                    message: "Recover order successfully.",
                    payload: order
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createOrder,
    updateOrder,
    deleteOrder,
    recoverOrder
}