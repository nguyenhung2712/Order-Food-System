const { Follow } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getByFKId = (type, id) => new Promise(async (resolve, reject) => {
    try {
        const response = type === "followed"
        ? await Follow.findAll({
            where: { followedId: id }
        })
        : await Follow.findAll({
            where: { followingId: id }
        });
        resolve({ 
            status: "success",
            message: "Get following users successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (followId) => new Promise(async (resolve, reject) => {
    try {
        const follow = await Follow.findOne({
            where: { id: followId }
        });
        resolve({
            status: "success",
            message: "Get follow successfully.",
            payload: follow
        });
    } catch (error) {
        reject(error);
    }
});

const createFollow = (followingId, followedId) => new Promise(async (resolve, reject) => {
    try {
        await Follow.create(
            {
                id: uuidv4(),
                deletedAt: null,
                status: 1,
                followedId,
                followingId
            }
        )
            .then(follow => {
                resolve({ 
                    status: "success",
                    message: "Create follow successfully.",
                    payload: follow
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteFollow = (followId) => new Promise(async (resolve, reject) => {
    try {
        await Follow.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: followId } }
        )
            .then(follow => {
                resolve({ 
                    status: "success",
                    message: "Delete follow successfully.",
                    payload: follow
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverFollow = (followId) => new Promise(async (resolve, reject) => {
    try {
        await Follow.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: followId } }
        )
            .then(follow => {
                resolve({ 
                    status: "success",
                    message: "Recover follow successfully.",
                    payload: follow
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getById,
    getByFKId,
    createFollow,
    deleteFollow,
    recoverFollow
}