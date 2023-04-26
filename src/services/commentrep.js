const { CommentRep, User, Comment } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await CommentRep.findAll({
            include: [
                { model: User, as: "user" },
                { model: Comment, as: "comment" },
                { model: CommentRep, as: "rep" }
            ]
        });
        resolve({
            status: "success",
            message: "Get comment replies successfully.",
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
                where: { userId: id },
                include: [
                    { model: User, as: "user" },
                    { model: Comment, as: "comment" },
                    { model: CommentRep, as: "rep" }
                ]
            })
            : await Comment.findAll({
                where: { commentId: id },
                include: [
                    { model: User, as: "user" },
                    { model: Comment, as: "comment" },
                    { model: CommentRep, as: "rep" }
                ]
            });
        resolve({
            status: "success",
            message: "Get comment replies successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (repId) => new Promise(async (resolve, reject) => {
    try {
        const rep = await CommentRep.findOne({
            where: { id: repId },
            include: [
                { model: User, as: "user" },
                { model: Comment, as: "comment" },
                { model: CommentRep, as: "rep" }
            ]
        });
        resolve({
            status: "success",
            message: "Get comment reply successfully.",
            payload: rep
        });
    } catch (error) {
        reject(error);
    }
});

const createRep = (userId, commentId, repId, repBody) => new Promise(async (resolve, reject) => {
    try {
        await CommentRep.create(
            {
                id: uuidv4(),
                ...repBody,
                deletedAt: null,
                status: 1,
                userId,
                commentId,
                repId
            }
        )
            .then(rep => {
                resolve({
                    status: "success",
                    message: "Create comment reply successfully.",
                    payload: rep
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateRep = (repId, repBody) => new Promise(async (resolve, reject) => {
    try {
        await CommentRep.update(
            { ...repBody },
            { where: { id: repId } }
        )
            .then(() => CommentRep.findByPk(repId, {
                include: [
                    { model: User, as: "user" },
                    { model: Comment, as: "comment" },
                    { model: CommentRep, as: "rep" }
                ]
            }))
            .then(rep => {
                resolve({
                    status: "success",
                    message: "Update comment reply successfully.",
                    payload: rep
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteRep = (repId) => new Promise(async (resolve, reject) => {
    try {
        await CommentRep.destroy({ where: { id: repId } })
            .then(rep => {
                resolve({
                    status: "success",
                    message: "Delete comment reply successfully.",
                    payload: rep
                });
            });
    } catch (error) {
        reject(error);
    }
});

/* const findByPk = (repId) => new Promise(async (resolve, reject) => {
    try {
        await CommentRep.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: repId } }
        )
            .then(() => CommentRep.findByPk(repId, {
                include: [
                    { model: User, as: "user" },
                    { model: Comment, as: "comment" },
                    { model: CommentRep, as: "rep" }
                ]
            }))
            .then(comment => {
                resolve({
                    status: "success",
                    message: "Get comment reply successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
}); */

module.exports = {
    getAll,
    getById,
    getByFKId,
    createRep,
    updateRep,
    deleteRep,
    /* findByPk */
}