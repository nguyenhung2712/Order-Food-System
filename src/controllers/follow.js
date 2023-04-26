const { followService } = require('../services');

const getByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await followService.getByFKId(type, id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await followService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createFollow = async (req, res) => {
    try {
        const { followedId, followingId } = req.body;
        const response = await followService.createFollow(followingId, followedId);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const deleteFollow = async (req, res) => {
    try {
        const response = await followService.deleteFollow(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getByFKId,
    getById,
    createFollow,
    deleteFollow,
}