const { adminService } = require('../services');
const dataExporter = require('json2csv').Parser;

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

const udraStaff = async (req, res) => {
    try {
        const { type, id } = req.params;
        let response;
        switch(type) {
            case "delete": response = await adminService.deleteStaff(id); break;
            case "recover": response = await adminService.recoverStaff(id); break;
            case "remove": response = await adminService.removeStaff(id); break;
            case "approve": response = await adminService.approveStaff(id); break;
        }
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
    udraStaff
}