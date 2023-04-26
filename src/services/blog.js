const { Blog, Like_Blog, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Blog.findAll({
            include: [
                { model: User, as: "user" }
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Blog.findAll({
            where: { userId },
            include: [
                { model: User, as: "user" }
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (blogId) => new Promise(async (resolve, reject) => {
    try {
        const blog = await Blog.findOne({
            where: { id: blogId },
            include: [
                { model: User, as: "user" }
            ]
        });
        resolve({
            status: "success",
            message: "Get blog successfully.",
            payload: blog
        });
    } catch (error) {
        reject(error);
    }
});

const getBySlug = (slug) => new Promise(async (resolve, reject) => {
    try {
        const blog = await Blog.findOne({
            where: { slug },
            include: [
                { model: User, as: "user" }
            ]
        });
        const { count: likeCount, rows: likes } = await Like_Blog.findAndCountAll({
            where: { blogId: blog.id, type: 1, status: 1 },
            include: [
                { model: User, as: "user" }
            ],
        });
        const { count: disLikeCount, rows: dislikes } = await Like_Blog.findAndCountAll({
            where: { blogId: blog.id, type: 0, status: 1 },
            include: [
                { model: User, as: "user" }
            ],
        });

        resolve({
            status: "success",
            message: "Get blog successfully.",
            payload: {
                blog,
                likeQuantity: likeCount,
                dislikeQuantity: disLikeCount,
                likes, dislikes
            }
        });
    } catch (error) {
        reject(error);
    }
});

const createBlog = (userId, blogBody) => new Promise(async (resolve, reject) => {
    try {
        await Blog.create(
            {
                id: uuidv4(),
                ...blogBody,
                deletedAt: null,
                status: 1,
                userId
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
        await Blog.update(
            { ...blogBody },
            { where: { id: blogId } }
        )
            .then(() => Blog.findByPk(blogId, {
                include: [
                    { model: User, as: "user" }
                ]
            }))
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
        await Blog.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: blogId } }
        )
            .then(() => Blog.findByPk(blogId, {
                include: [
                    { model: User, as: "user" }
                ]
            }))
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
        await Blog.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: blogId } }
        )
            .then(() => Blog.findByPk(blogId, {
                include: [
                    { model: User, as: "user" }
                ]
            }))
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

const interactBlog = (userId, blogId, type) => new Promise(async (resolve, reject) => {
    try {
        await Like_Blog.findOrCreate({
            where: { userId, blogId, type: type },
            defaults: {
                deletedAt: null,
                status: 1
            }
        })
            .then(async ([interact, created]) => {
                if (!created) {
                    interact.status === 1
                        ? await Like_Blog.update(
                            {
                                deletedAt: new Date(),
                                status: 0
                            },
                            { where: { userId, blogId, type } }
                        )
                        : await Like_Blog.update(
                            {
                                deletedAt: null,
                                status: 1
                            },
                            { where: { userId, blogId, type } }
                        );
                }
                const updatedInteraction = await Like_Blog.findOne({
                    where: { userId, blogId, type },
                    include: [
                        { model: User, as: "user" }
                    ],
                });
                resolve({
                    status: "success",
                    message: "Interact blog successfully.",
                    payload: updatedInteraction ? updatedInteraction : interact
                });
            });
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    getAll,
    getById,
    getByUserId,
    getBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    recoverBlog,
    interactBlog
}