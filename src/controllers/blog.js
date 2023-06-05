const { blogService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await blogService.getAll();
        return res.json(response);

    } catch (error) {
        return res.status(400).json(error);
    }
}

const getAllBySort = async (req, res) => {
    try {
        const sortBy = req.query.sort;
        const response = await blogService.getAllBySort(sortBy);
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
        console.log(error);
        return res.status(400).json(error);
    }
}

const getBySortUserId = async (req, res) => {
    try {
        const sortBy = req.query.sort;
        const response = await blogService.getBySortUserId(req.params.id, sortBy);
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

const getByUserId = async (req, res) => {
    try {
        const response = await blogService.getByUserId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await blogService.getById(req.params.id);
        return res.json(response);

    } catch (error) {
        return res.status(400).json(error);
    }
}

const getBySlug = async (req, res) => {
    try {
        const response = await blogService.getBySlug(req.params.slug);
        return res.json(response);

    } catch (error) {
        return res.status(400).json(error);
    }
}

const createBlog = async (req, res) => {
    try {
        const { userId, ...blogBody } = req.body;
        const response = await blogService.createBlog(userId, blogBody);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateBlog = async (req, res) => {
    try {
        const response = await blogService.updateBlog(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleBlog = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await blogService.deleteBlog(id)
            : await blogService.recoverBlog(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const interactBlog = async (req, res) => {
    try {
        const { userId, blogId, type, reason } = req.body;
        const response = await blogService.interactBlog(userId, blogId, type, reason);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const uploadBlogImage = async (req, res) => {
    try {
        let pictureFile = req.file;

        if (!pictureFile)
            return res.status(400).json({ message: "No picture attached!" });

        return res.json({ location: pictureFile.path });
    } catch (error) {
        return res.status(400).json(error);
    }
}
const getAllReports = async (req, res) => {
    try {
        const response = await blogService.getAllReports();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}
const solveReport = async (req, res) => {
    try {
        const { blogId, userId } = req.body;
        const response = await blogService.solveReport(blogId, userId);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
const getSolvedBlogs = async (req, res) => {
    try {
        const response = await blogService.getSolvedBlogs();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}
const deleteReport = async (req, res) => {
    try {
        const response = await blogService.deleteReport(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getAllBySort,
    getByUserId,
    getBySortUserId,
    getById,
    getBySlug,
    createBlog,
    updateBlog,
    toggleBlog,
    interactBlog,
    uploadBlogImage,
    getAllReports,
    solveReport,
    getSolvedBlogs,
    deleteReport
}