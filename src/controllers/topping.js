const { toppingService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await toppingService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await toppingService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createTopping = async (req, res) => {
    try {
        const response = await toppingService.createTopping(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateTopping = async (req, res) => {
    try {
        const response = await toppingService.updateTopping(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const cdrDishTopping = async (req, res) => {
    try {
        const type = req.params.type;
        const { toppingId, dishId } = req.body
        let response;
        switch (type) {
            case "create": response = await toppingService.createDishTopping(dishId, toppingId); break;
            case "delete": response = await toppingService.deleteDishTopping(dishId, toppingId); break;
        }
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    createTopping,
    updateTopping,
    cdrDishTopping
}