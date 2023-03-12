const { commentRepService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await commentRepService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await commentRepService.getByFKId(type, id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await commentRepService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createRep = async (req, res) => {
    try {
        const { userId, commentId, ...body } = req.body;
        const response = await commentRepService.createRep(userId, commentId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateRep = async (req, res) => {
    try {
        const response = await commentRepService.updateRep(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleRep = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await commentRepService.deleteRep(id)
        : await commentRepService.recoverRep(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getByFKId,
    getById,
    createRep,
    updateRep,
    toggleRep
}