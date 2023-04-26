const { Follow } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Follow.findAll();
        resolve({
            status: "success",
            message: "Get all follow successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

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
            message: "Get follows successfully.",
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
        await Follow.destroy({ where: { id: followId } })
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

module.exports = {
    getAll,
    getById,
    getByFKId,
    createFollow,
    deleteFollow
}