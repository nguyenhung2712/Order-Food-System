const { dishService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await dishService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await dishService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createDish = async (req, res) => {
    try {
        const response = await dishService.createDish(req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateDish = async (req, res) => {
    try {
        const response = await dishService.updateDish(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleDish = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await dishService.deleteDish(id)
        : await dishService.recoverDish(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    createDish,
    updateDish,
    toggleDish
}