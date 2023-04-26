const { Cart, CartItem, Dish, DishType } = require("../models");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const getCartByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const cart = await Cart.findOne({
            where: { userId },
            /* include: [
                { model: Dish, as: "product", include: [{ model: DishType, as: "type" }] },
                { model: Cart, as: "cart" }
            ], */
        });
        resolve({
            status: "success",
            message: "Get cart successfully.",
            payload: cart
        });
    } catch (error) {
        reject(error);
    }
});

const getItemsByCartId = (cartId) => new Promise(async (resolve, reject) => {
    try {
        const cartItems = await CartItem.findAll({
            where: { cartId: cartId },
            include: [
                { model: Dish, as: "product", include: [{ model: DishType, as: "type" }] },
                { model: Cart, as: "cart" }
            ],
        });
        resolve({
            status: "success",
            message: "Get cart items successfully.",
            payload: cartItems
        });
    } catch (error) {
        reject(error);
    }
});

const addItemToCart = (cartId, cartItem) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.findOne({ where: { cartId: cartId, dishId: cartItem.dishId } })
            .then(async (item) => {
                if (!item) {
                    await CartItem.create({
                        id: uuidv4(),
                        quantity: cartItem.quantity,
                        expiryDate: cartItem.expiryDate,
                        dishId: cartItem.dishId,
                        cartId
                    })
                } else {
                    await CartItem.update({ quantity: item.quantity + cartItem.quantity }, { where: { id: item.id } });
                }
            });
        resolve({
            status: "success",
            message: "Insert item to cart successfully."
        });
    } catch (error) {
        reject(error);
    }
});

/* const addItemsToCart = (cartId, itemsArr) => new Promise(async (resolve, reject) => {
    try {
        let newDate = new Date();
        itemsArr.forEach(async (item) => {
            await CartItem.create({
                id: uuidv4(),
                quantity: item.quantity,
                expiryDate: newDate.setDate(newDate.getDate + 1),
                deletedAt: null,
                status: 1,
                userId: item.userId,
                cartId: cartId
            })
        });
        resolve({
            status: "success",
            message: "Insert items to cart successfully."
        });
    } catch (error) {
        reject(error);
    }
}); */

/* const updateItem = (cartId, item) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.update(
            { quantity: item.quantity, },
            {
                where: {
                    id: item.id,
                    cartId
                }
            }
        )
            .then(() => CartItem.findOne({
                where: {
                    id: item.id,
                    cartId
                }
            })
            )
            .then(item => {
                resolve({
                    status: "success",
                    message: "Update item successfully.",
                    payload: item
                });
            });

    } catch (error) {
        reject(error);
    }
});

const updateItems = (cartId, itemsArr) => new Promise(async (resolve, reject) => {
    try {
        itemsArr.forEach(async (item) => {
            await CartItem.update(
                { quantity: item.quantity },
                {
                    where: {
                        id: item.id,
                        cartId
                    }
                }
            );
        });
        resolve({
            status: "success",
            message: "Update items successfully.",
        });

    } catch (error) {
        reject(error);
    }
}) */

const removeItem = (dishId, cartId) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.findOne({ where: { dishId, cartId } })
            .then(async (item) => {
                if (item.quantity - 1 <= 0) {
                    await CartItem.destroy({ where: { dishId, cartId } });
                    resolve({
                        status: "success",
                        message: "Remove cart item successfully."
                    });
                } else {
                    await CartItem.update({ quantity: item.quantity - 1 }, { where: { dishId, cartId } })
                    resolve({
                        status: "success",
                        message: "Update cart item successfully."
                    });
                }
            });
    } catch (error) {
        reject(error);
    }
});

const deleteItem = (dishId, cartId) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.destroy({ where: { dishId, cartId } });
        resolve({
            status: "success",
            message: "Remove cart item successfully."
        });
    } catch (error) {
        reject(error);
    }
});

const clearItems = (cartId) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.destroy({ where: { cartId } })
            .then(res => {
                resolve({
                    status: "success",
                    message: "Clear all items successfully.",
                });
            });
    } catch (error) {
        reject(error);
    }
});

/* const recoverItem = (itemId) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: itemId } }
        )
            .then(() => CartItem.findByPk(itemId))
            .then(item => {
                resolve({
                    status: "success",
                    message: "Recover cart item successfully.",
                    payload: item
                });
            });
    } catch (error) {
        reject(error);
    }
}); */

module.exports = {
    getCartByUserId,
    getItemsByCartId,
    addItemToCart,
    /* addItemsToCart,
    updateItem,
    updateItems,
    recoverItem, */
    removeItem,
    deleteItem,
    clearItems
}