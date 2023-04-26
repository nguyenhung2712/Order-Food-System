const { dishTypeService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await dishTypeService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await dishTypeService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getBySlug = async (req, res) => {
    try {
        const response = await dishTypeService.getBySlug(req.body.slug);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createDishType = async (req, res) => {
    try {
        const response = await dishTypeService.createDishType(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateDishType = async (req, res) => {
    try {
        const response = await dishTypeService.updateDishType({ dishId: req.params.id, ...req.body });
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleDishType = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await dishTypeService.deleteDishType(id)
            : await dishTypeService.recoverDishType(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    getBySlug,
    createDishType,
    updateDishType,
    toggleDishType
}