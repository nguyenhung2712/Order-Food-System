const { Topping, DishTopping } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require('sequelize');

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Topping.findAll({
            include: [

            ],
        });
        resolve({
            status: "success",
            message: "Get toppings successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (toppingId) => new Promise(async (resolve, reject) => {
    try {
        const topping = await Topping.findOne({
            where: { id: toppingId },
            include: [

            ],
        });
        resolve({
            status: "success",
            message: "Get topping successfully.",
            payload: topping
        });
    } catch (error) {
        reject(error);
    }
});

const createTopping = (toppingBody) => new Promise(async (resolve, reject) => {
    try {
        await Topping.create(
            {
                id: uuidv4(),
                ...toppingBody
            }
        )
            .then(topping => {
                resolve({
                    status: "success",
                    message: "Create topping successfully.",
                    payload: topping
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateTopping = (toppingId, toppingBody) => new Promise(async (resolve, reject) => {
    try {
        await Topping.update(
            { ...toppingBody },
            { where: { id: toppingId } }
        )
            .then(() => Topping.findByPk(toppingId, {
                include: [

                ],
            }))
            .then(topping => {
                resolve({
                    status: "success",
                    message: "Update topping successfully.",
                    payload: topping
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteTopping = (toppingId) => new Promise(async (resolve, reject) => {
    try {
        await Topping.destroy({ where: { id: toppingId } })
            .then(topping => {
                resolve({
                    status: "success",
                    message: "Delete topping successfully.",
                    payload: topping
                });
            });
    } catch (error) {
        reject(error);
    }
});

const createDishTopping = (dishId, toppingId) => new Promise(async (resolve, reject) => {
    try {
        await DishTopping.create(
            { dishId, tppId: toppingId }
        )
            .then(res => {
                resolve({
                    status: "success",
                    message: "Create dish's topping successfully.",
                    payload: res
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteDishTopping = (dishId, toppingId) => new Promise(async (resolve, reject) => {
    try {
        await DishTopping.destroy({ where: { dishId, tppId: toppingId } })
            .then(res => {
                resolve({
                    status: "success",
                    message: "Delete dish's topping successfully.",
                    payload: res
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createTopping,
    updateTopping,
    deleteTopping,

    createDishTopping,
    deleteDishTopping
}