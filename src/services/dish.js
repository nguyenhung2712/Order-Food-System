const { Dish, DishType, Rate, OrderDetail } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes, Op } = require('sequelize');
const sequelize = require("../../connectdb");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        let date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const subquery = `(SELECT IFNULL(SUM(quantity), 0) FROM orderdetails WHERE dishId = Dish.id AND DATE(createdAt) >= '${date.slice(0, 10)}')`;
        const response = await Dish.findAll({
            include: [
                { model: DishType, as: 'type' },
                { model: Rate }
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            `(Dish.quantityInDay - ${subquery})`
                        ),
                        'quantityLeft'
                    ]
                ]
            }
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

const getAllAvailable = (sortBy, categories = [], query, rating) => new Promise(async (resolve, reject) => {
    try {
        let date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        let type = await DishType.findAll({ where: { id: { [Op.or]: categories } } });
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
            const subquery = `(SELECT IFNULL(SUM(quantity), 0) FROM orderdetails WHERE dishId = Dish.id AND DATE(createdAt) >= '${date.slice(0, 10)}')`;
            const avgScore = sequelize.fn('AVG', sequelize.col('Rates.score'));
            const avgScoreSafe = sequelize.fn('COALESCE', avgScore, 0);
            const avgScoreRounded = sequelize.fn('ROUND', avgScoreSafe, 0);
            const attributes = [
                ...Object.keys(Dish.rawAttributes),
                [avgScoreRounded, 'average_rating'],
                [
                    sequelize.literal(
                        `(Dish.quantityInDay - ${subquery})`
                    ),
                    'quantityLeft'
                ]
            ];
            const where = {
                typeId: { [Op.or]: typeIds },
                dishName: { [Op.like]: `%${query}%` },
            };
            const include = [
                { model: DishType, as: "type" },
                { model: Rate }
            ];
            const group = ['Dish.id'];
            const having = sequelize.literal(`
                ROUND(IFNULL(AVG(Rates.score), 0), 0) IN (${rating.join(",")})
            `);
            response = await Dish.findAll({
                attributes: attributes,
                where: where,
                include: include,
                group: group,
                having: having,
                order: [
                    ['price', sortType]
                ],
                /* group: ['Dish.id', 'Dish.dishName'],
                having: sequelize.where(
                    sequelize.fn('ABS', sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('rates.score')), 0) - 2.8),
                    { [Op.lte]: 0.001 }
                ) */
            });
        } else {
            const types = await DishType.findAll();
            let res = [];
            let orderedQueryStr = "SELECT d.id, dishName, d.price, image, " +
                "ingredients, d.deletedAt, d.status, d.createdAt, d.updatedAt, typeId, d.slug, dishNameEn, ingredients, views, " +
                "ROUND(IFNULL(AVG(r.score), 0), 0) AS average_rating " +
                "FROM orderdetails od JOIN dishes d ON d.id = od.dishId " +
                "LEFT JOIN dishtypes t ON d.typeId = t.id " +
                "LEFT JOIN rates r ON d.id = r.dishId " +
                `WHERE typeId IN (${typeIds.map(name => `'${name}'`).join(',')}) ` +
                "GROUP BY d.id " +
                `HAVING ROUND(IFNULL(AVG(r.score), 0), 0) IN (${rating.join(",")})` +
                "ORDER BY SUM(quantity) DESC ";
            let unorderedQueryStr = "SELECT d.id, dishName, d.price, image, " +
                "ingredients, d.deletedAt, d.status, d.createdAt, d.updatedAt, typeId, d.slug, dishNameEn, ingredients, views, " +
                "ROUND(IFNULL(AVG(r.score), 0), 0) AS average_rating " +
                "FROM dishes d " +
                "LEFT JOIN orderdetails od ON od.dishID = d.id " +
                "LEFT JOIN dishtypes t ON d.typeId = t.id " +
                "LEFT JOIN rates r ON d.id = r.dishId " +
                `WHERE od.dishID IS NULL AND typeId IN (${typeIds.map(name => `'${name}'`).join(',')}) ` +
                "GROUP BY d.id " +
                ` HAVING ROUND(IFNULL(AVG(r.score), 0), 0) IN (${rating.join(",")})`;
            await sequelize.query(orderedQueryStr,
                {
                    raw: true, nest: true, type: QueryTypes.SELECT,
                }
            )
                .then(async (orderedRes) => {
                    let temp = orderedRes.map((order) => {
                        return {
                            ...order,
                            type: types.filter(type => type.id === order.typeId)[0]
                        }
                    });
                    res.push(temp);
                    await sequelize.query(unorderedQueryStr,
                        {
                            raw: true, nest: true, type: QueryTypes.SELECT,
                            include: [
                                { model: DishType, as: "type" }
                            ]
                        }
                    )
                        .then(async (unorderedRes) => {
                            let temp = unorderedRes.map((unorder) => {
                                return {
                                    ...unorder,
                                    type: types.filter(type => type.id === unorder.typeId)[0]
                                }
                            });
                            res.push(temp);
                        })
                });
            response = res.flat();
        }
        resolve({
            status: "success",
            message: "Get dishes successfully.",
            payload: response,
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (dishId) => new Promise(async (resolve, reject) => {
    try {
        let date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const subquery = `(SELECT IFNULL(SUM(quantity), 0) FROM orderdetails WHERE dishId = Dish.id AND DATE(createdAt) >= '${date.slice(0, 10)}')`;
        const dish = await Dish.findOne({
            where: { id: dishId },
            include: [
                { model: DishType, as: "type" },
                { model: Rate },
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            `(Dish.quantityInDay - ${subquery})`
                        ),
                        'quantityLeft'
                    ]
                ]
            }
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
        let date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const subquery = `(SELECT IFNULL(SUM(quantity), 0) FROM orderdetails WHERE dishId = Dish.id AND DATE(createdAt) >= '${date.slice(0, 10)}')`;
        const dish = await Dish.findOne({
            where: { slug: slug },
            include: [
                { model: DishType, as: "type" }
            ],
            attributes: {
                include: [
                    [
                        sequelize.literal(
                            `(Dish.quantityInDay - ${subquery})`
                        ),
                        'quantityLeft'
                    ]
                ]
            }
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
            .then(async () => await Dish.findByPk(dishId, {
                where: {
                    include: [
                        { model: DishType, as: "type" },
                        { model: Rate },
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
                        { model: DishType, as: "type" },
                        { model: Rate },
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
                        { model: DishType, as: "type" },
                        { model: Rate },
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