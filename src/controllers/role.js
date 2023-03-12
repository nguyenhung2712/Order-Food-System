const { roleService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await roleService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await roleService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createRole = async (req, res) => {
    try {
        const response = await roleService.createRole(req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateRole = async (req, res) => {
    try {
        const response = await roleService.updateRole(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleRole = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await roleService.deleteRole(id)
        : await roleService.recoverRole(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    createRole,
    updateRole,
    toggleRole
}