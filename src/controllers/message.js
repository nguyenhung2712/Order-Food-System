const { messageService } = require('../services');
const cloudinary = require('cloudinary').v2;

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
        const response = type === "delete"
            ? await messageService.deleteMessage(id)
            : await messageService.recoverMessage(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const uploadImage = async (req, res) => {
    try {
        let pictureFiles = req.files;
        if (!pictureFiles)
            return res.status(400).json({ message: "No picture attached!" });

        let imageStr = pictureFiles.reduce((imageStr, image) => {
            return imageStr + "|" + image.path;
        }, "");
        return res.json({ image: imageStr });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getByConverId,
    getById,
    createMessage,
    updateMessage,
    toggleMessage,
    uploadImage
}