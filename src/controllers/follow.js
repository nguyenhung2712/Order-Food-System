const { followService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await followService.getByFKId(type, id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await followService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createFollow = async (req, res) => {
    try {
        const { followedId, followingId, ...body } = req.body;
        const response = await followService.createFollow(followedId, followingId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleFollow = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await followService.deleteFollow(id)
        : await followService.recoverFollow(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getByFKId,
    getById,
    createFollow,
    toggleFollow
}