const { adminService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await adminService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await adminService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createStaff = async (req, res) => {
    try {
        const { password, ...body } = req.body;
        const response = await adminService.createStaff(password, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateStaff = async (req, res) => {
    try {
        const response = await adminService.updateStaff(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
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
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    createStaff,
    updateStaff,
    udraStaff
}