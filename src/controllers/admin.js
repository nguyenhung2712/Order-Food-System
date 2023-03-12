const { adminService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await adminService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await adminService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createStaff = async (req, res) => {
    try {
        const { password, ...body } = req.body;
        const response = await adminService.createStaff(password, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateStaff = async (req, res) => {
    try {
        const response = await adminService.updateStaff(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleStaff = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await adminService.deleteStaff(id)
        : await adminService.recoverStaff(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getById,
    createStaff,
    updateStaff,
    toggleStaff
}