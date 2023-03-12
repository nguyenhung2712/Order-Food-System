const { commentService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await commentService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await commentService.getByFKId(type, id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await commentService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}


const createComment = async (req, res) => {
    try {
        const { userId, blogId, ...body } = req.body;
        const response = await commentService.createComment(userId, blogId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateComment = async (req, res) => {
    try {
        const response = await commentService.updateComment(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleComment = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await commentService.deleteComment(id)
        : await commentService.recoverComment(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getByFKId,
    getById,
    createComment,
    updateComment,
    toggleComment
}