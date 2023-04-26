const { converService } = require('../services'); 

const getAll = async (req, res) => {
    try {
        const response = await converService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByStaffId = async (req, res) => {
    try {
        const response = await converService.getByStaffId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await converService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createConver = async (req, res) => {
    try {
        const { userId, adminId, ...body } = req.body;
        const response = await converService.createConver(userId, adminId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateConver = async (req, res) => {
    try {
        const response = await converService.updateConver(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleConver = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await converService.deleteConver(id)
        : await converService.recoverConver(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
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