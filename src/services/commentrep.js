const { CommentRep, User, Comment, Interact } = require("../models");
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

const interactRep = (userId, repId, type, reason) => new Promise(async (resolve, reject) => {
    try {
        await Interact.findOne({
            where: { userId, repId, type }
        })
            .then(async (res) => {
                if (res) {
                    if (reason) {
                        await Interact.create(
                            {
                                userId, repId, type,
                                deletedAt: null,
                                status: 1,
                                reason
                            },
                        );
                    } else {
                        await Interact.update(
                            {
                                deletedAt: res.status === 1 ? new Date() : null,
                                status: res.status === 1 ? 0 : 1
                            },
                            { where: { userId, repId, type } }
                        );
                    }
                    resolve({
                        status: "success",
                        message: "Interact rep successfully."
                    });
                } else {
                    await Interact.create(
                        {
                            userId, repId, type,
                            deletedAt: null,
                            status: 1,
                            reason
                        },
                    )
                    resolve({
                        status: "success",
                        message: "Interact rep comment successfully."
                    });
                }
            });
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    getAll,
    getById,
    getByFKId,
    createRep,
    updateRep,
    deleteRep,
    interactRep
    /* findByPk */
}