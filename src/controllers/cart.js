
const { cartService } = require('../services');

const getCartByUserId = async (req, res) => {
    try {
        const response = await cartService.getCartByUserId(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getItemsByCartId = async (req, res) => {
    try {
        const response = await cartService.getItemsByCartId(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const addItemToCart = async (req, res) => {
    try {
        const response = await cartService.addItemToCart(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const addItemsToCart = async (req, res) => {
    try {
        const response = await cartService.addItemsToCart(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

/* const updateItem = async (req, res) => {
    try {
        const response = await cartService.updateItem(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateItems = async (req, res) => {
    try {
        const response = await cartService.updateItems(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
} */

/* const toggleItem = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await cartService.deleteItem(id)
            : await cartService.recoverItem(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
} */

const removeItem = async (req, res) => {
    try {
        const response = await cartService.removeItem(req.params.pId, req.params.cId)
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const deleteItem = async (req, res) => {
    try {
        const response = await cartService.deleteItem(req.params.pId, req.params.cId)
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const clearItems = async (req, res) => {
    try {
        const response = await cartService.clearItems(req.params.id)
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getCartByUserId,
    getItemsByCartId,
    addItemToCart,
    addItemsToCart,
    removeItem,
    deleteItem,
    clearItems
    /* updateItem,
    updateItems,
    toggleItem */
}