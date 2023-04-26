const { roleService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await roleService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await roleService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createRole = async (req, res) => {
    try {
        const response = await roleService.createRole(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateRole = async (req, res) => {
    try {
        const response = await roleService.updateRole(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleRole = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await roleService.deleteRole(id)
        : await roleService.recoverRole(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getAdminRoleByAdminId = async (req, res) => {
    try {
        const response = await roleService.getAdminRoleByAdminId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getOtherAdminRoleByAdminId = async (req, res) => {
    try {
        const response = await roleService.getOtherAdminRoleByAdminId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const cdrAdminRole = async (req, res) => {
    try {
        const type = req.params.type;
        const { adminId, roleId } = req.body
        let response;
        switch(type) {
            case "create": response = await roleService.createAdminRole(adminId, roleId); break;
            case "delete": response = await roleService.deleteAdminRole(adminId, roleId); break;
        }
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    createRole,
    updateRole,
    toggleRole,
    getOtherAdminRoleByAdminId,
    getAdminRoleByAdminId,
    cdrAdminRole
}