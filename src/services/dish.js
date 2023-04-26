const { Dish, DishType } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes, Op } = require('sequelize');
const sequelize = require("../../connectdb");

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

const getAllAvailable = (sortBy, categories = []) => new Promise(async (resolve, reject) => {
    try {
        let type = await DishType.findAll(
            {
                where: {
                    id: { [Op.or]: categories }
                }
            }
        );
        type = JSON.parse(JSON.stringify(type));
        let typeIds = type.map(type => type.id);
        let sortType;
        switch (sortBy) {
            case "highest": sortType = "DESC"; break;
            case "most-order": sortType = "most-order"; break;
            default: sortType = "ASC"; break;
        }
        let response;
        if (sortType !== "most-order") {
            response = await Dish.findAll({
                where: { status: 1, typeId: { [Op.or]: typeIds } },
                include: [
                    { model: DishType, as: "type" }
                ],
                order: [
                    ['price', sortType]
                ],
            });
        } else {
            let res = [];
            let orderedQueryStr = "SELECT d.id, dishName, d.price, image, " +
                "ingredients, d.deletedAt, d.status, d.createdAt, d.updatedAt, typeId " +
                "FROM orderdetails od JOIN dishes d ON d.id = od.dishId " +
                `WHERE d.status = 1 AND typeId IN (${typeIds.map(name => `'${name}'`).join(',')}) ` +
                "GROUP BY d.id " +
                "ORDER BY SUM(quantity) DESC";
            let unorderedQueryStr = "SELECT d.id, dishName, d.price, image, " +
                "ingredients, d.deletedAt, d.status, d.createdAt, d.updatedAt, typeId " +
                "FROM dishes d " +
                "LEFT JOIN orderdetails od ON od.dishID = d.id " +
                `WHERE od.dishID IS NULL AND d.status = 1 AND typeId IN (${typeIds.map(name => `'${name}'`).join(',')}) `;
            await sequelize.query(orderedQueryStr,
                {
                    raw: true, type: QueryTypes.SELECT,
                    include: [
                        { model: DishType, as: "type" }
                    ]
                }
            )
                .then(async (orderedRes) => {
                    res.push(orderedRes);
                    await sequelize.query(unorderedQueryStr,
                        {
                            raw: true, type: QueryTypes.SELECT,
                            include: [
                                { model: DishType, as: "type" }
                            ]
                        }
                    )
                        .then(unorderedRes => {
                            res.push(unorderedRes);
                        })
                });
            response = res.flat();
        }
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

const getBySlug = (slug) => new Promise(async (resolve, reject) => {
    try {
        const dish = await Dish.findOne({
            where: { slug: slug },
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
            .then(() => Dish.findByPk(dishId, {
                where: {
                    include: [
                        { model: DishType, as: "type" }
                    ]
                }
            }))
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
            .then(() => Dish.findByPk(dishId, {
                where: {
                    include: [
                        { model: DishType, as: "type" }
                    ]
                }
            }))
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
            .then(() => Dish.findByPk(dishId, {
                where: {
                    include: [
                        { model: DishType, as: "type" }
                    ]
                }
            }))
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
    getAllAvailable,
    getById,
    getBySlug,
    createDish,
    updateDish,
    deleteDish,
    recoverDish,
}