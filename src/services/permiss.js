const { Permission } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Permission.findAll();
        resolve({
            status: "success",
            message: "Get permissions successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (permissId) => new Promise(async (resolve, reject) => {
    try {
        const permiss = await Permission.findOne({
            where: { id: permissId }
        });
        resolve({
            status: "success",
            message: "Get permission successfully.",
            payload: permiss
        });
    } catch (error) {
        reject(error);
    }
});

const createPermiss = (permissBody) => new Promise(async (resolve, reject) => {
    try {
        await Permission.create(
            {
                id: uuidv4(),
                ...permissBody,
                deletedAt: null,
                status: 1,
                password: hash
            }
        )
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Create permission successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updatePermiss = (permissId, permissBody) => new Promise(async (resolve, reject) => {
    try {
        await Permission.update(
            { ...permissBody },
            { where: { id: permissId } }
        )
            .then(permission => {
                resolve({ 
                    status: "success",
                    message: "Update permission successfully.",
                    payload: permission
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deletePermiss = (permissId) => new Promise(async (resolve, reject) => {
    try {
        await Permission.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: permissId } }
        )
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Delete permission successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverPermiss = (permissId) => new Promise(async (resolve, reject) => {
    try {
        await Permission.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: permissId } }
        )
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Recover permission successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createPermiss,
    updatePermiss,
    deletePermiss,
    recoverPermiss
}