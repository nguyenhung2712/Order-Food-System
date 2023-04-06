const { Comment } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Comment.findAll();
        resolve({
            status: "success",
            message: "Get comments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByFKId = (type, id) => new Promise(async (resolve, reject) => {
    try {
        const response = type === "user" 
            ? await Comment.findAll({
                where: { userId: id }
            })
            : await Comment.findAll({
                where: { blogId: id }
            });
        resolve({ 
            status: "success",
            message: "Get comments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (commentId) => new Promise(async (resolve, reject) => {
    try {
        const comment = await Comment.findOne({
            where: { id: commentId }
        });
        resolve({
            status: "success",
            message: "Get comment successfully.",
            payload: comment
        });
    } catch (error) {
        reject(error);
    }
});

const createComment = (userId, blogId, commentBody) => new Promise(async (resolve, reject) => {
    try {
        await Comment.create(
            {
                id: uuidv4(),
                ...commentBody,
                deletedAt: null,
                status: 1,
                userId,
                blogId
            }
        )
            .then(comment => {
                resolve({ 
                    status: "success",
                    message: "Create comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateComment = (commentId, commentBody) => new Promise(async (resolve, reject) => {
    try {
        await Comment.update(
            { ...commentBody },
            { where: { id: commentId } }
        )
            .then(() => Comment.findByPk(commentId))
            .then(comment => {
                resolve({ 
                    status: "success",
                    message: "Update comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteComment = (commentId) => new Promise(async (resolve, reject) => {
    try {
        await Comment.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: commentId } }
        )
            .then(() => Comment.findByPk(commentId))
            .then(comment => {
                resolve({ 
                    status: "success",
                    message: "Delete comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverComment = (commentId) => new Promise(async (resolve, reject) => {
    try {
        await Comment.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: commentId } }
        )
            .then(() => Comment.findByPk(commentId))
            .then(comment => {
                resolve({ 
                    status: "success",
                    message: "Recover comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByFKId,
    createComment,
    updateComment,
    deleteComment,
    recoverComment
}