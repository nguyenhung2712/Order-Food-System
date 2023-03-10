const { Payment } = require("../models");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Payment.findAll();
        resolve({ 
            status: "success",
            message: "Get payments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByOrderId = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Payment.findAll({
            where: { orderId }
        });
        resolve({ 
            status: "success",
            message: "Get payment successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (paymentId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Payment.findOne({
            where: { id: paymentId }
        });
        resolve({ 
            status: "success",
            message: "Get payment successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const updatePayment = (paymentId, paymentBody) => new Promise(async (resolve, reject) => {
    try {
        await Payment.update(
            { ...paymentBody },
            { where: { id: paymentId } }
        )
            .then(payment => {
                resolve({ 
                    status: "success",
                    message: "Update payment successfully.",
                    payload: payment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deletePayment = (paymentId) => new Promise(async (resolve, reject) => {
    try {
        await Payment.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: paymentId } }
        )
            .then(payment => {
                resolve({ 
                    status: "success",
                    message: "Delete payment successfully.",
                    payload: payment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverPayment = (paymentId) => new Promise(async (resolve, reject) => {
    try {
        await Payment.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: paymentId } }
        )
            .then(payment => {
                resolve({ 
                    status: "success",
                    message: "Recover payment successfully.",
                    payload: payment
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByOrderId,
    updatePayment,
    deletePayment,
    recoverPayment
}