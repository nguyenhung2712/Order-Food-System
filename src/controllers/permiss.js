const { permissService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await permissService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await permissService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createPermiss = async (req, res) => {
    try {
        const response = await permissService.createPermiss(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updatePermiss = async (req, res) => {
    try {
        const response = await permissService.updatePermiss(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const togglePermiss = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await permissService.deletePermiss(id)
        : await permissService.recoverPermiss(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getPermissionByRoleId = async (req, res) => {
    try {
        const response = await permissService.getPermissionByRoleId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const cdrRolePermission = async (req, res) => {
    try {
        const type = req.params.type;
        const { permissionId, roleId } = req.body
        let response;
        switch(type) {
            case "create": response = await permissService.createRolePermission(permissionId, roleId); break;
            case "delete": response = await permissService.deleteRolePermission(permissionId, roleId); break;
        }
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getById,
    createPermiss,
    updatePermiss,
    togglePermiss,

    getPermissionByRoleId,
    cdrRolePermission
}