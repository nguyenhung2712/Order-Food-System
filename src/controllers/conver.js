const { converService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await converService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByStaffId = async (req, res) => {
    try {
        const response = await converService.getByStaffId(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await converService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createConver = async (req, res) => {
    try {
        const { userId, adminId, ...body } = req.body;
        const response = await converService.createConver(userId, adminId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateConver = async (req, res) => {
    try {
        const response = await converService.updateConver(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleConver = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await converService.deleteConver(id)
        : await converService.recoverConver(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getByStaffId,
    getById,
    createConver,
    updateConver,
    toggleConver
}