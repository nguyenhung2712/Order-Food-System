const { orderService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await orderService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await orderService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createOrder = async (req, res) => {
    try {
        const { userId, payment, order } = req.body;
        const response = await orderService.createOrder(userId, payment, order);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateOrder = async (req, res) => {
    try {
        const response = await orderService.updateOrder(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleOrder = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await orderService.deleteOrder(id)
        : await orderService.recoverOrder(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    createOrder,
    updateOrder,
    toggleOrder
}