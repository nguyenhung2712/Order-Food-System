const { commentService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await commentService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const sortBy = req.query.sort;
        const response = await commentService.getByFKId(type, id, sortBy);
        const items = JSON.parse(JSON.stringify(response.payload));
        let results = {};
        if (req.query.limit !== "" && req.query.page !== "") {
            const limit = Number(req.query.limit);
            const page = Number(req.query.page);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

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
        } else {
            results.results = items;
        }

        return res.json(results);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await commentService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}


const createComment = async (req, res) => {
    try {
        const { userId, blogId, ...body } = req.body;
        const response = await commentService.createComment(userId, blogId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const uploadCommentImage = async (req, res) => {
    try {
        let pictureFile = req.file;
        let id = req.params.id;
        if (!pictureFile)
            return res.status(400).json({ message: "No picture attached!" });
        const response = await commentService.updateComment(id,
            { image: pictureFile.path }
        );

        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateComment = async (req, res) => {
    try {
        const response = await commentService.updateComment(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const deleteComment = async (req, res) => {
    try {
        const response = await commentService.deleteComment(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const interactComment = async (req, res) => {
    try {
        const { userId, commentId, type, reason } = req.body;
        const response = await commentService.interactComment(userId, commentId, type, reason);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getByFKId,
    getById,
    createComment,
    uploadCommentImage,
    updateComment,
    deleteComment,
    interactComment
}