const { Cart, CartItem } = require("../models");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const getCartById = (cartId) => new Promise(async (resolve, reject) => {
    try {
        const cart = await Cart.findOne({
            where: { id: cartId }
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
            where: { cartId: cartId }
        });
        resolve({
            status: "success",
            message: "Insert item to cart successfully.",
            payload: cartItems
        });
    } catch (error) {
        reject(error);
    }
});

const addItemToCart = (cartId, item) => new Promise(async (resolve, reject) => {
    try {
        let newDate = new Date();
        await CartItem.create({
            id: uuidv4(),
            quantity: item.quantity,
            expiryDate: newDate.setDate(newDate.getDate + 1),
            deletedAt: null,
            status: 1,
            userId: item.userId,
            cartId
        }).then(item => {
            resolve({ 
                status: "success",
                message: "Insert item to cart successfully.",
                payload: item
            });
        });
        
    } catch (error) {
        reject(error);
    }
});

const addItemsToCart = (cartId, itemsArr) => new Promise(async (resolve, reject) => {
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
});

const updateItem = (cartId, item) => new Promise(async (resolve, reject) => {
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
})

const deleteItem = (itemId) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.update(
            { 
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: itemId } }
        )
            .then(item => {
                resolve({ 
                    status: "success",
                    message: "Delete cart item successfully.",
                    payload: item
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverItem = (itemId) => new Promise(async (resolve, reject) => {
    try {
        await CartItem.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: itemId } }
        )
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
});

module.exports = {
    getCartById,
    getItemsByCartId,
    addItemToCart,
    addItemsToCart,
    updateItem,
    updateItems,
    deleteItem,
    recoverItem,
}