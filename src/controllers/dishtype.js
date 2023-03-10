const { dishTypeService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await dishTypeService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await dishTypeService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createDishType = async (req, res) => {
    try {
        const response = await dishTypeService.createDishType(req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateDishType = async (req, res) => {
    try {
        const response = await dishTypeService.updateDishType({ dishId: req.params.id, ...req.body });
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleDishType = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await dishTypeService.deleteDishType(id)
        : await dishTypeService.recoverDishType(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    createDishType,
    updateDishType,
    toggleDishType
}