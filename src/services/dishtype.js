const { DishType } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await DishType.findAll();
        resolve({ 
            status: "success",
            message: "Get types successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (typeId) => new Promise(async (resolve, reject) => {
    try {
        const type = await DishType.findOne({
            where: { id: typeId }
        });
        resolve({ 
            status: "success",
            message: "Get type successfully.",
            payload: type
        });
    } catch (error) {
        reject(error);
    }
});

const createDishType = (typeName) => new Promise(async (resolve, reject) => {
    try {
        await DishType.create({
            id: uuidv4(),
            typeName,
            status: 1,
            deletedAt: null
        })
            .then(type => {
                resolve({ 
                    status: "success",
                    message: "Create type successfully.",
                    payload: type
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateDishType = (typeId, typeName) => new Promise(async (resolve, reject) => {
    try {
        await DishType.update(
            { typeName },
            { where: { id: typeId } }
        )
            .then(type => {
                resolve({ 
                    status: "success",
                    message: "Update type successfully.",
                    payload: type
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteDishType = (typeId) => new Promise(async (resolve, reject) => {
    try {
        await DishType.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: typeId } }
        )
            .then(type => {
                resolve({ 
                    status: "success",
                    message: "Delete type successfully.",
                    payload: type
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverDishType = (typeId) => new Promise(async (resolve, reject) => {
    try {
        await DishType.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: typeId } }
        )
            .then(type => {
                resolve({ 
                    status: "success",
                    message: "Recover type successfully.",
                    payload: type
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createDishType,
    updateDishType,
    deleteDishType,
    recoverDishType
}