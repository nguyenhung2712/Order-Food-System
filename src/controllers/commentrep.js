const { commentRepService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await commentRepService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await commentRepService.getByFKId(type, id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await commentRepService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createRep = async (req, res) => {
    try {
        const { userId, commentId, repId, ...body } = req.body;
        const response = await commentRepService.createRep(userId, commentId, repId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const uploadRepCommentImage = async (req, res) => {
    try {
        let pictureFile = req.file;
        let id = req.params.id;
        if (!pictureFile)
            return res.status(400).json({ message: "No picture attached!" });
        const response = await commentRepService.updateRep(id,
            { image: pictureFile.path }
        );
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const updateRep = async (req, res) => {
    try {
        const response = await commentRepService.updateRep(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleRep = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await commentRepService.deleteRep(id)
            : await commentRepService.recoverRep(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getByFKId,
    getById,
    createRep,
    uploadRepCommentImage,
    updateRep,
    toggleRep
}