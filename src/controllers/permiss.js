const { permissService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await permissService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await permissService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createPermiss = async (req, res) => {
    try {
        const response = await permissService.createPermiss(req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updatePermiss = async (req, res) => {
    try {
        const response = await permissService.updatePermiss(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const togglePermiss = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await permissService.deletePermiss(id)
        : await permissService.recoverPermiss(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    createPermiss,
    updatePermiss,
    togglePermiss
}