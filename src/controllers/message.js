const { messageService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await messageService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByConverId = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await messageService.getByConverId(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await messageService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createMessage = async (req, res) => {
    try {
        const { userId, adminId, converId, ...body } = req.body;
        const response = await messageService.createMessage(userId, adminId, converId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateMessage = async (req, res) => {
    try {
        const response = await messageService.updateMessage(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleMessage = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await messageService.deleteMessage(id)
        : await messageService.recoverMessage(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
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