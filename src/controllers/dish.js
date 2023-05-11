const cloudinary = require('cloudinary').v2;

const { dishService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await dishService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getAllAvailable = async (req, res) => {
    try {
        const sortBy = req.query.sort;
        const query = req.query.query;
        const { categories } = req.body;
        const response = await dishService.getAllAvailable(sortBy, categories, query);
        const items = JSON.parse(JSON.stringify(response.payload));
        const limit = Number(req.query.limit);
        const page = Number(req.query.page);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        if (endIndex < response.payload.length) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        results.itemsLen = items.length;
        results.results = items.slice(startIndex, endIndex);
        return res.json(results);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await dishService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getBySlug = async (req, res) => {
    try {
        const response = await dishService.getBySlug(req.params.slug);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createDish = async (req, res) => {
    try {
        const { typeId, ...body } = req.body;
        const response = await dishService.createDish(typeId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateDish = async (req, res) => {
    try {
        const response = await dishService.updateDish(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleDish = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await dishService.deleteDish(id)
            : await dishService.recoverDish(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
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
        return res.json(response);
    } catch (error) {
        res.json(error);

    }
}

module.exports = {
    getAll,
    getAllAvailable,
    getById,
    getBySlug,
    createDish,
    updateDish,
    toggleDish,
    uploadDishImage
}