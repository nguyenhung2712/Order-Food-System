const { locationService } = require('../services');

const getById = async (req, res) => {
    try {
        const { type, id } = req.params;
        let response;
        switch (type) {
            case "ward": response = await locationService.getWardById(id); break;
            case "district": response = await locationService.getDistrictById(id); break;
            case "province": response = await locationService.getProvinceById(id); break;
        }
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getListsByFKId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const response = type === "ward"
            ? await locationService.getWardsByDistrictId(id)
            : await locationService.getDistrictsByProvinceId(id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getProvinces = async (req, res) => {
    try {
        const response = await locationService.getProvinces();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getById,
    getProvinces,
    getListsByFKId
}