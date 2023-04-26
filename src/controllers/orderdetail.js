const { orderDetailService } = require('../services');

const getByOrderId = async (req, res) => {
    try {
        const response = await orderDetailService.getByOrderId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await orderDetailService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createDetail = async (req, res) => {
    try {
        const response = await orderDetailService.createDetail(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateDetail = async (req, res) => {
    try {
        const response = await orderDetailService.updateDetail(req.params.id, ...req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleDetail = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await orderDetailService.deleteDetail(id)
            : await orderDetailService.recoverDetail(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getByOrderId,
    getById,
    createDetail,
    updateDetail,
    toggleDetail
}