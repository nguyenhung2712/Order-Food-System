const { rateService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getById = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await rateService.getById(type, id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createRate = async (req, res) => {
    try {
        const { userId, dishId, ...body } = req.body;
        const response = await rateService.createRate(userId, dishId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateRate = async (req, res) => {
    try {
        const response = await rateService.updateRate(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const deleteRate = async (req, res) => {
    try {
        const response = await rateService.deleteRate(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const recoverRate = async (req, res) => {
    try {
        const response = await rateService.recoverRate(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getById,
    createRate,
    updateRate,
    deleteRate,
    recoverRate
}