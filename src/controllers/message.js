const { messageService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await messageService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByConverId = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await messageService.getByConverId(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await messageService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createMessage = async (req, res) => {
    try {
        const { userId, adminId, converId, ...body } = req.body;
        const response = await messageService.createMessage(userId, adminId, converId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateMessage = async (req, res) => {
    try {
        const response = await messageService.updateMessage(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleMessage = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await messageService.deleteMessage(id)
        : await messageService.recoverMessage(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getByConverId,
    getById,
    createMessage,
    updateMessage,
    toggleMessage
}