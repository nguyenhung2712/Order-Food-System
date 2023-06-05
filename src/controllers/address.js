const { addressService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await addressService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getByFKId = async (req, res) => {
    try {
        const { districtId, provinceId, wardId } = req.body;
        const response = await addressService.getByFKId(districtId, provinceId, wardId);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getById = async (req, res) => {
    try {
        const response = await addressService.getById(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createAddress = async (req, res) => {
    try {
        const { districtId, provinceId, wardId, ...body } = req.body;
        const response = await addressService.createAddress(districtId, provinceId, wardId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateAddress = async (req, res) => {
    try {
        const response = await addressService.updateAddress(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleAddress = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
            ? await addressService.deleteAddress(id)
            : await addressService.recoverAddress(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getUserAddressById = async (req, res) => {
    try {
        const response = await addressService.getUserAddressById(req.params.id);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const getUserAddressByDefault = async (req, res) => {
    try {
        const response = await addressService.getUserAddressByDefault(req.params.id);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const createUserAddress = async (req, res) => {
    try {
        const { userId, addressId, ...info } = req.body;
        const response = await addressService.createUserAddress(userId, addressId, info);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateUserAddress = async (req, res) => {
    try {
        const { userId, addressId, ...body } = req.body;
        const response = await addressService.updateUserAddress(userId, addressId, body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const toggleUserAddress = async (req, res) => {
    try {
        const { type } = req.params;
        const { userId, addressId } = req.body;
        const response = type === "delete"
            ? await addressService.deleteUserAddress(userId, addressId)
            : await addressService.recoverUserAddress(userId, addressId);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const deleteUserAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;
        const response = await addressService.deleteUserAddress(userId, addressId)
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getByFKId,
    getById,
    createAddress,
    updateAddress,
    toggleAddress,

    getUserAddressById,
    getUserAddressByDefault,
    createUserAddress,
    updateUserAddress,
    toggleUserAddress,
    deleteUserAddress
}