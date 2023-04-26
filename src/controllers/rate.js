const { rateService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getById = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await rateService.getById(type, id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createRate = async (req, res) => {
    try {
        const { userId, dishId, ...body } = req.body;
        const response = await rateService.createRate(userId, dishId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateRate = async (req, res) => {
    try {
        const response = await rateService.updateRate(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const deleteRate = async (req, res) => {
    try {
        const response = await rateService.deleteRate(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const recoverRate = async (req, res) => {
    try {
        const response = await rateService.recoverRate(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getById,
    createRate,
    updateRate,
    deleteRate,
    recoverRate
}