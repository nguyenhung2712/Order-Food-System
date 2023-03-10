
const { cartService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getCartById = async (req, res) => {
    try {
        const response = await cartService.getCartById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getItemsByCartId = async (req, res) => {
    try {
        const response = await cartService.getItemsByCartId(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const addItemToCart = async (req, res) => {
    try {
        const response = await cartService.addItemToCart(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const addItemsToCart = async (req, res) => {
    try {
        const response = await cartService.addItemsToCart(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateItem = async (req, res) => {
    try {
        const response = await cartService.updateItem(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateItems = async (req, res) => {
    try {
        const response = await cartService.updateItems(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleItem = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response =  type === "delete"
        ? await cartService.deleteItem(id)
        : await cartService.recoverItem(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getCartById,
    getItemsByCartId,
    addItemToCart,
    addItemsToCart,
    updateItem,
    updateItems,
    toggleItem
}