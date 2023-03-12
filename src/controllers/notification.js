const { notifService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await notifService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByReceiverId = async (req, res) => {
    try {
        const response = await notifService.getByReceiverId(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await notifService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}


const createNotif = async (req, res) => {
    try {
        const { userId, ...body } = req.body;
        const response = await notifService.createNotif(userId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateNotif = async (req, res) => {
    try {
        const response = await notifService.updateNotif(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleNotif = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await notifService.deleteNotif(id)
        : await notifService.recoverNotif(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
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