const { paymentService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await paymentService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await paymentService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByOrderId = async (req, res) => {
    try {
        const response = await paymentService.getByOrderId(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updatePayment = async (req, res) => {
    try {
        const response = await paymentService.updatePayment(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const togglePayment = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await paymentService.deletePayment(id)
        : await paymentService.recoverPayment(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    getByOrderId,
    updatePayment,
    togglePayment
}