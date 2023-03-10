const { User, Blog } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Blog.findAll();
        if (!response || response.length === 0) {
            reject({
                status: "error",
                message: "Don't Exist!" 
            });
        } else {
            
        }
    } catch (error) {
        reject(error);
    }
});

const getByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Blog.findAll({
            where: { userId }
        });
        if (!response || response.length === 0) {
            reject({ 
                status: "error",
                message: "Don't Exist!" 
            });
        } else {
            resolve({ 
                status: "success",
                message: "Get blogs successfully.",
                payload: response
            });
        }
    } catch (error) {
        reject(error);
    }
});

const getById = (blogId) => new Promise(async (resolve, reject) => {
    try {
        const blog = await Blog.findOne({
            where: { id: blogId }
        });
        if (!blog) {
            reject({ 
                status: "error",
                message: "Blog Doesn't Exist!" 
            });
        } else {
            resolve({ 
                status: "success",
                message: "Get blog successfully.",
                payload: blog
            });
        }
    } catch (error) {
        reject(error);
    }
});

const createBlog = (userId, blogBody) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            reject({ 
                status: "error",
                message: "User Doesn't Exist!" 
            });
        }
        await Blog.create(
            {
                id: uuidv4(),
                ...blogBody,
                deletedAt: null,
                status: 1,
                userId: userId
            }
        )
            .then(blog => {
                resolve({ 
                    status: "success",
                    message: "Create blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateBlog = (blogId, blogBody) => new Promise(async (resolve, reject) => {
    try {
        const blog = await Blog.findOne({
            where: { id: blogId }
        });
        if (!blog) {
            reject({ 
                status: "error",
                message: "Blog Doesn't Exist!" 
            });
        }
        await Blog.update(
            { ...blogBody },
            { where: { id: blogId } }
        )
            .then(blog => {
                resolve({ 
                    status: "success",
                    message: "Update blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteBlog = (blogId) => new Promise(async (resolve, reject) => {
    try {
        const dish = await Dish.findOne({
            where: { id: dishId }
        });
        if (!dish) {
            reject({ 
                status: "error",
                message: "Dish Doesn't Exist!" 
            });
        }

        await Blog.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: blogId } }
        )
            .then(blog => {
                resolve({ 
                    status: "success",
                    message: "Delete blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverBlog = (blogId) => new Promise(async (resolve, reject) => {
    try {
        const dish = await Dish.findOne({
            where: { id: blogId }
        });
        if (!dish) {
            reject({ 
                status: "error",
                message: "Dish Doesn't Exist!" 
            });
        }

        await Blog.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: blogId } }
        )
            .then(blog => {
                resolve({ 
                    status: "success",
                    message: "Recover blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByUserId,
    createBlog,
    updateBlog,
    deleteBlog,
    recoverBlog
}