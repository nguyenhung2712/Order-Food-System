const cloudinary = require('cloudinary').v2;

const { userService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await userService.getAll();
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(401).json(error);
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const response = await userService.getUser(id);
        return res.json(response);
    } catch (error) {
        return res.status(401).json(error);
    }
}

const createUser = async (req, res) => {
    try {
        const response = await userService.createUser(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(401).json(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const response = await userService.updateUser(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(401).json(error);
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const response = await userService.changePassword(req.params.id, newPassword, oldPassword);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const uploadAvatarUser = async (req, res) => {
    try {
        let pictureFile = req.file;
        let id = req.params.id;
        if (!pictureFile)
            return res.status(400).json({ message: "No picture attached!" });
        const response = await userService.updateUser(id,
            { avatar: pictureFile.path }
        );

        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getUser,
    changePassword,
    createUser,
    updateUser,
    uploadAvatarUser
}