const cloudinary = require('cloudinary').v2;

const { blogService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await blogService.getAll();
        console.log(JSON.stringify(response.payload));
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByUserId = async (req, res) => {
    try {
        const response = await blogService.getByUserId(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await blogService.getById(req.params.id);
        res.json(response);
        
    } catch (error) {
        return interalServerError(res);
    }
}

const createBlog = async (req, res) => {
    try {
        const { userId, ...blogBody } = req.body;
        const response = await blogService.createBlog(userId, blogBody);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateBlog = async (req, res) => {
    try {
        const response = await blogService.updateBlog(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleBlog = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await blogService.deleteBlog(id)
        : await blogService.recoverBlog(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const interactBlog = async (req, res) => {
    try {
        const { userId, blogId } = req.params;
        const response = await blogService.interactBlog(userId, blogId);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const uploadBlogImage = async (req, res) => {
    try {
        let pictureFile = req.file;
        
        if (!pictureFile)
            return res.status(400).json({ message: "No picture attached!" });

        res.json({ location : pictureFile.path }); 
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getByUserId,
    getById,
    createBlog,
    updateBlog,
    toggleBlog,
    interactBlog,
    uploadBlogImage
}