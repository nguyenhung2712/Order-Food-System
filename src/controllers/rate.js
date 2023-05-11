const { rateService } = require('../services');

const getById = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await rateService.getById(type, id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getWithPaginate = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = await rateService.getById(type, id);
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

const createRate = async (req, res) => {
    try {
        const { userId, dishId, ...body } = req.body;
        const response = await rateService.createRate(userId, dishId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateRate = async (req, res) => {
    try {
        const response = await rateService.updateRate(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const deleteRate = async (req, res) => {
    try {
        const response = await rateService.deleteRate(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

/* const uploadRatingImage = async (req, res) => {
    try {
        let pictureFile = req.file;
        let id = req.params.id;
        if (!pictureFile)
            return res.status(400).json({ message: "No picture attached!" });
        const response = await rateService.updateRate(id,
            { image: pictureFile.path }
        );
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
} */

module.exports = {
    getById,
    getWithPaginate,
    createRate,
    updateRate,
    deleteRate,
    /* uploadRatingImage */
}