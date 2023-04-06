const { Dish, DishType } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Dish.findAll({
            include: [
                { model: DishType, as: "type" }
            ]
        });
        resolve({ 
            status: "success",
            message: "Get dishes successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (dishId) => new Promise(async (resolve, reject) => {
    try {
        const dish = await Dish.findOne({
            where: { id: dishId },
            include: [
                { model: DishType, as: "type" }
            ]
        });
        resolve({ 
            status: "success",
            message: "Get dish successfully.",
            payload: dish
        });
    } catch (error) {
        reject(error);
    }
});

const createDish = (typeId, dishBody) => new Promise(async (resolve, reject) => {
    try {
        await Dish.create(
            {
                id: uuidv4(),
                ...dishBody,
                typeId: typeId
            }
        )
            .then(dish => {
                resolve({ 
                    status: "success",
                    message: "Create dish successfully.",
                    payload: dish
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateDish = (dishId, dishBody) => new Promise(async (resolve, reject) => {
    try {
        
        await Dish.update(
            { ...dishBody },
            { where: { id: dishId } }
        )
            .then(() => Dish.findByPk(dishId, { where: {
                include: [
                    { model: DishType, as: "type" }
                ]
            }}))
            .then(dish => {
                resolve({ 
                    status: "success",
                    message: "Update dish successfully.",
                    payload: dish
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteDish = (dishId) => new Promise(async (resolve, reject) => {
    try {
        await Dish.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: dishId } }
        )
            .then(() => Dish.findByPk(dishId, { where: {
                include: [
                    { model: DishType, as: "type" }
                ]
            }}))
            .then(dish => {
                resolve({ 
                    status: "success",
                    message: "Delete dish successfully.",
                    payload: dish
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverDish = (dishId) => new Promise(async (resolve, reject) => {
    try {
        await Dish.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: dishId } }
        )
            .then(() => Dish.findByPk(dishId, { where: {
                include: [
                    { model: DishType, as: "type" }
                ]
            }}))
            .then(dish => {
                resolve({ 
                    status: "success",
                    message: "Recover dish successfully.",
                    payload: dish
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createDish,
    updateDish,
    deleteDish,
    recoverDish
}