const {
    Dish, DishType, Rate, DishTopping, DishHasSize, DishSize,
    Topping, OrderDetail, Interact, User, Order
} = require("../models");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes, Op } = require('sequelize');
const sequelize = require("../../connectdb");
const translate = require('translate-google');

const getStatisticInfo = (dishId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Dish.findOne({
            where: { id: dishId },
            include: [
                {
                    model: OrderDetail, include: [
                        {
                            model: Order, as: "order", include: [
                                { model: User, as: "user" }
                            ]
                        }
                    ]
                },
                { model: Interact },
                { model: Rate, include: [{ model: User, as: "user" }] },
            ],
        })
        resolve({
            status: "success",
            message: "Get dishes statistic info successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByTypeId = (typeId) => new Promise(async (resolve, reject) => {
    try {
        let startDate = new Date(new Date().setHours(0, 0, 0, 0));
        const dishes = await Dish.findAll({
            where: { typeId },
            include: [
                { model: DishType, as: 'type' },
                { model: Rate },
                { model: DishTopping, include: [{ model: Topping, as: "topping" }] },
                { model: DishHasSize, include: [{ model: DishSize, as: "size" }] },
                { model: Interact },
            ],
        });

        const results = [];

        for (const dish of dishes) {
            const details = await OrderDetail.findAll({
                where: {
                    dishId: dish.id,
                    createdAt: {
                        [Op.gt]: startDate,
                    },
                }
            });
            if (dish.DishHasSizes.length > 0) {
                const defaultQuantity = dish.DishHasSizes.map(dhs => ({
                    price: dhs.price,
                    quantityInDay: dhs.quantityInDay,
                    size: dhs.size
                }));
                const priceTotals = new Map();
                details.forEach(item => {
                    if (priceTotals.has(Number(item.price))) {
                        priceTotals.set(Number(item.price), priceTotals.get(Number(item.price)) + item.quantity);
                    } else {
                        priceTotals.set(Number(item.price), item.quantity);
                    }
                });
                const soldQuantity = [];
                priceTotals.forEach((total, price) => {
                    soldQuantity.push({ price, quantityInDay: total });
                });

                const dishHasSizes = defaultQuantity.map(item => {
                    const totalInA = soldQuantity.find(a => a.price === Number(item.price))?.quantityInDay || 0;
                    return {
                        price: item.price,
                        quantityLeft: item.quantityInDay - totalInA,
                        quantityInDay: item.quantityInDay,
                        size: item.size
                    };
                });

                results.push({
                    ...dish.toJSON(),
                    DishHasSizes: dishHasSizes
                });
            } else {
                results.push({
                    ...dish.toJSON(),
                    quantityLeft: dish.quantityInDay - details.length
                });
            }
        }
        resolve({
            status: "success",
            message: "Get dishes successfully.",
            payload: results
        });
    } catch (error) {
        reject(error);
    }
});

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        let startDate = new Date(new Date().setHours(0, 0, 0, 0));
        const dishes = await Dish.findAll({
            include: [
                { model: DishType, as: 'type' },
                { model: Rate },
                { model: DishTopping, include: [{ model: Topping, as: "topping" }] },
                { model: DishHasSize, include: [{ model: DishSize, as: "size" }] },
                { model: Interact },
            ],
        });

        const results = [];

        for (const dish of dishes) {
            const details = await OrderDetail.findAll({
                where: {
                    dishId: dish.id,
                    createdAt: {
                        [Op.gt]: startDate,
                    },
                }
            });
            if (dish.DishHasSizes.length > 0) {
                const defaultQuantity = dish.DishHasSizes.map(dhs => ({
                    price: dhs.price,
                    quantityInDay: dhs.quantityInDay,
                    size: dhs.size
                }));
                const priceTotals = new Map();
                details.forEach(item => {
                    if (priceTotals.has(Number(item.price))) {
                        priceTotals.set(Number(item.price), priceTotals.get(Number(item.price)) + item.quantity);
                    } else {
                        priceTotals.set(Number(item.price), item.quantity);
                    }
                });
                const soldQuantity = [];
                priceTotals.forEach((total, price) => {
                    soldQuantity.push({ price, quantityInDay: total });
                });

                const dishHasSizes = defaultQuantity.map(item => {
                    const totalInA = soldQuantity.find(a => a.price === Number(item.price))?.quantityInDay || 0;
                    return {
                        price: item.price,
                        quantityLeft: item.quantityInDay - totalInA,
                        quantityInDay: item.quantityInDay,
                        size: item.size
                    };
                });

                results.push({
                    ...dish.toJSON(),
                    DishHasSizes: dishHasSizes
                });
            } else {
                results.push({
                    ...dish.toJSON(),
                    quantityLeft: dish.quantityInDay - details.length
                });
            }
        }
        resolve({
            status: "success",
            message: "Get dishes successfully.",
            payload: results
        });
    } catch (error) {
        reject(error);
    }
});

const getAllAvailable = (sortBy, categories = [], query, rating) => new Promise(async (resolve, reject) => {
    try {
        rating = rating.filter(rating => rating || rating === 0);
        let startDate = new Date(new Date().setHours(0, 0, 0, 0));
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
            const dishes = await Dish.findAll({
                where: {
                    [Op.and]: [
                        { typeId: { [Op.or]: typeIds } },
                        { dishName: { [Op.like]: `%${query}%` } },
                    ]
                },
                include: [
                    { model: DishType, as: "type" },
                    { model: Rate },
                    { model: DishTopping, include: [{ model: Topping, as: "topping" }] },
                    { model: DishHasSize, include: [{ model: DishSize, as: "size" }] },
                    { model: Interact },
                ],
                order: [
                    ['price', sortType]
                ],
            });
            const dishTemp = dishes.map(dish => {
                const plainDish = dish.get({ plain: true });
                let { Rates, ...remain } = plainDish;
                return {
                    ...remain,
                    avg_rate: Rates.length > 0
                        ? Rates.reduce((acc, rate) => acc + Number(rate.score), 0) / Rates.length
                        : 0
                }
            });
            const dishRes = dishTemp.filter(dish => rating.includes(Math.round(dish.avg_rate)))

            const results = [];

            for (const dish of dishRes) {

                const dishId = dish.id;
                const details = await OrderDetail.findAll({
                    where: {
                        dishId,
                        createdAt: { [Op.gt]: startDate, },
                    }
                });
                if (dish.DishHasSizes.length > 0) {
                    const defaultQuantity = dish.DishHasSizes.map(dhs => ({
                        price: dhs.price,
                        quantityInDay: dhs.quantityInDay,
                        size: dhs.size
                    }));
                    const priceTotals = new Map();
                    details.forEach(item => {
                        if (priceTotals.has(Number(item.price))) {
                            priceTotals.set(Number(item.price), priceTotals.get(Number(item.price)) + item.quantity);
                        } else {
                            priceTotals.set(Number(item.price), item.quantity);
                        }
                    });
                    const soldQuantity = [];
                    priceTotals.forEach((total, price) => {
                        soldQuantity.push({ price, quantityInDay: total });
                    });

                    const dishHasSizes = defaultQuantity.map(item => {
                        const totalInA = soldQuantity.find(a => a.price === Number(item.price))?.quantityInDay || 0;
                        return {
                            price: item.price,
                            quantityLeft: item.quantityInDay - totalInA,
                            quantityInDay: item.quantityInDay,
                            size: item.size
                        };
                    });

                    results.push({
                        ...dish,
                        DishHasSizes: dishHasSizes
                    });
                } else {
                    results.push({
                        ...dish,
                        quantityLeft: dish.quantityInDay - details.length
                    });
                }
            }
            response = results;
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
                { raw: true, nest: true, type: QueryTypes.SELECT, }
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
        let startDate = new Date(new Date().setHours(0, 0, 0, 0));
        const details = await OrderDetail.findAll({
            where: {
                dishId,
                createdAt: {
                    [Op.gt]: startDate,
                },
            }
        });
        const dish = await Dish.findOne({
            where: { id: dishId },
            include: [
                { model: Rate },
                { model: DishType, as: "type" },
                { model: DishTopping, include: [{ model: Topping, as: "topping" }] },
                { model: DishHasSize, include: [{ model: DishSize, as: "size" }] },
                { model: Interact }
            ],
        });
        if (dish.DishHasSizes.length > 0) {
            let defaultQuantity = dish.DishHasSizes.map(dhs => ({
                price: dhs.price,
                quantityInDay: dhs.quantityInDay,
                size: dhs.size
            }));
            const priceTotals = new Map();
            details.forEach(item => {
                if (priceTotals.has(Number(item.price))) {
                    priceTotals.set(Number(item.price), priceTotals.get(Number(item.price)) + item.quantity);
                } else {
                    priceTotals.set(Number(item.price), item.quantity);
                }
            });
            const soldQuantity = [];
            priceTotals.forEach((total, price) => {
                soldQuantity.push({ price, quantityInDay: total });
            });

            const dishHasSizes = defaultQuantity.map(item => {
                const totalInA = soldQuantity.find(a => a.price === Number(item.price))?.quantityInDay || 0;
                return {
                    price: item.price,
                    quantityLeft: item.quantityInDay - totalInA,
                    quantityInDay: item.quantityInDay,
                    size: item.size
                };
            });
            resolve({
                status: "success",
                message: "Get dish successfully.",
                payload: {
                    ...dish.toJSON(),
                    DishHasSizes: dishHasSizes
                }
            });
        } else {
            resolve({
                status: "success",
                message: "Get dish successfully.",
                payload: {
                    ...dish.toJSON(),
                    quantityLeft: dish.quantityInDay - details.length
                }
            });
        }

    } catch (error) {
        reject(error);
    }
});

const getBySlug = (slug) => new Promise(async (resolve, reject) => {
    try {
        const dish = await Dish.findOne({
            where: { slug: slug },
            include: [
                { model: Rate },
                { model: Interact },
                { model: DishType, as: "type" },
                { model: DishTopping, include: [{ model: Topping, as: "topping" }] },
                { model: DishHasSize, include: [{ model: DishSize, as: "size" }] },
            ],
        });
        const details = await OrderDetail.findAll({ where: { dishId: dish.id } });
        if (dish.DishHasSizes.length > 0) {
            let defaultQuantity = dish.DishHasSizes.map(dhs => ({
                price: dhs.price,
                quantityInDay: dhs.quantityInDay,
                size: dhs.size
            }));
            const priceTotals = new Map();
            details.forEach(item => {
                if (priceTotals.has(Number(item.price))) {
                    priceTotals.set(Number(item.price), priceTotals.get(Number(item.price)) + item.quantity);
                } else {
                    priceTotals.set(Number(item.price), item.quantity);
                }
            });
            const soldQuantity = [];
            priceTotals.forEach((total, price) => {
                soldQuantity.push({ price, quantityInDay: total });
            });

            const dishHasSizes = defaultQuantity.map(item => {
                const totalInA = soldQuantity.find(a => a.price === Number(item.price))?.quantityInDay || 0;
                return {
                    price: item.price,
                    quantityLeft: item.quantityInDay - totalInA,
                    quantityInDay: item.quantityInDay,
                    size: item.size
                };
            });
            resolve({
                status: "success",
                message: "Get dish successfully.",
                payload: {
                    ...dish.toJSON(),
                    DishHasSizes: dishHasSizes
                }
            });
        } else {
            resolve({
                status: "success",
                message: "Get dish successfully.",
                payload: {
                    ...dish.toJSON(),
                    quantityLeft: dish.quantityInDay - details.length
                }
            });
        }
    } catch (error) {
        reject(error);
    }
});

const createDish = (typeId, dishBody) => new Promise(async (resolve, reject) => {
    try {
        let dishNameEn = await translate(dishBody.dishName + " Việt Nam", { from: "auto", to: "en" });
        dishNameEn = dishNameEn.split(" ").filter(text => text.toLowerCase() !== "vietnamese").join(" ");
        let ingredientsEn = await translate(dishBody.ingredients, { from: "auto", to: "en" });

        await Dish.create(
            {
                id: uuidv4(),
                ...dishBody,
                ingredientsEn,
                dishNameEn,
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
        const dish = await Dish.findByPk(dishId);
        let dishNameEn, ingredientsEn;
        if (dishBody.dishName) {
            dishNameEn = await translate(dishBody.dishName + " Việt Nam", { from: "auto", to: "en" });
            dishNameEn = dishNameEn.split(" ").filter(text => text.toLowerCase() !== "vietnamese").join(" ");
        }
        if (dishBody.ingredients) {
            ingredientsEn = await translate(dishBody.ingredients, { from: "auto", to: "en" });
        }

        await Dish.update(
            {
                ...dishBody,
                ingredientsEn: ingredientsEn ? ingredientsEn : dish.ingredientsEn,
                dishNameEn: dishNameEn ? dishNameEn : dish.dishNameEn,
            },
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
    getByTypeId,
    getAllAvailable,
    getById,
    getBySlug,
    createDish,
    updateDish,
    deleteDish,
    recoverDish,
    getStatisticInfo
}