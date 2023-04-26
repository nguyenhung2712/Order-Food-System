const { notifService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await notifService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByReceiverId = async (req, res) => {
    try {
        const response = await notifService.getByReceiverId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await notifService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}


const createNotif = async (req, res) => {
    try {
        const { userId, ...body } = req.body;
        const response = await notifService.createNotif(userId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateNotif = async (req, res) => {
    try {
        const response = await notifService.updateNotif(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleNotif = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await notifService.deleteNotif(id)
        : await notifService.recoverNotif(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getByReceiverId,
    getById,
    createNotif,
    updateNotif,
    toggleNotif
}