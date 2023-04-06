const cloudinary = require('cloudinary').v2;

const { dishService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await dishService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await dishService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createDish = async (req, res) => {
    try {
        const { typeId, ...body } = req.body;
        const response = await dishService.createDish(typeId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateDish = async (req, res) => {
    try {
        const response = await dishService.updateDish(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleDish = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await dishService.deleteDish(id)
        : await dishService.recoverDish(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const uploadDishImage = async (req, res) => {
    try {
        let pictureFiles = req.files;
        let id = req.params.id;

        if (!pictureFiles)
            return res.status(400).json({ message: "No picture attached!" });
        
        let imageUploadRes = pictureFiles.map((image) => 
            cloudinary.uploader.upload(
                image.path,
                { 
                    use_filename: true, 
                    unique_filename: false
                }
            )
        );
        
        let imageResponses = await Promise.all(imageUploadRes);

        let imageStr = imageResponses.reduce((imageStr, image) => {
            return imageStr + "|" + image.url;
        }, "");
        
        const dishRes = await dishService.getById(id);
        const response = await dishService.updateDish(id, 
            { image: dishRes.payload.image + imageStr }
        );
        res.json(response); 
    } catch (error) {
        res.json(error); 
        
    }
}

module.exports = {
    getAll,
    getById,
    createDish,
    updateDish,
    toggleDish,
    uploadDishImage
}