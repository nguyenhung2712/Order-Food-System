const { orderDetailService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getByOrderId = async (req, res) => {
    try {
        const response = await orderDetailService.getByOrderId(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await orderDetailService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createDetail = async (req, res) => {
    try {
        const { dishId, orderId, ...body } = req.body;
        const response = await orderDetailService.createDetail(dishId, orderId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateDetail = async (req, res) => {
    try {
        const response = await orderDetailService.updateDetail(req.params.id, ...req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleDetail = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await orderDetailService.deleteDetail(id)
        : await orderDetailService.recoverDetail(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getByOrderId,
    getById,
    createDetail,
    updateDetail,
    toggleDetail
}