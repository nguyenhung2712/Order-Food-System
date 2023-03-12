const { CommentRep } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await CommentRep.findAll();
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
                where: { userId: id }
            })
            : await Comment.findAll({
                where: { commentId: id }
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
            where: { id: repId }
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

const createRep = (userId, commentId, repBody) => new Promise(async (resolve, reject) => {
    try {
        await CommentRep.create(
            {
                id: uuidv4(),
                ...repBody,
                deletedAt: null,
                status: 1,
                userId,
                commentId
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
        await CommentRep.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: repId } }
        )
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

const recoverRep = (repId) => new Promise(async (resolve, reject) => {
    try {
        await CommentRep.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: repId } }
        )
            .then(comment => {
                resolve({ 
                    status: "success",
                    message: "Recover comment reply successfully.",
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
    createRep,
    updateRep,
    deleteRep,
    recoverRep
}