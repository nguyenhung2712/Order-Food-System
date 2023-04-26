const { paymentService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await paymentService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await paymentService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByOrderId = async (req, res) => {
    try {
        const response = await paymentService.getByOrderId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updatePayment = async (req, res) => {
    try {
        const response = await paymentService.updatePayment(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const togglePayment = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await paymentService.deletePayment(id)
        : await paymentService.recoverPayment(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    getByOrderId,
    updatePayment,
    togglePayment
}