const { addressService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await addressService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getByFKId = async (req, res) => {
    try {
        const { districtId, provinceId, wardId } = req.body;
        const response = await addressService.getByFKId(districtId, provinceId, wardId);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getById = async (req, res) => {
    try {
        const response = await addressService.getById(req.params.id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const createAddress = async (req, res) => {
    try {
        const { districtId, provinceId, wardId, ...body } = req.body;
        const response = await addressService.createAddress(districtId, provinceId, wardId, body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const updateAddress = async (req, res) => {
    try {
        const response = await addressService.updateAddress(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const toggleAddress = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "delete"
        ? await addressService.deleteAddress(id)
        : await addressService.recoverAddress(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getByFKId,
    getById,
    createAddress,
    updateAddress,
    toggleAddress
}