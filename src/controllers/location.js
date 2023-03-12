const { locationService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getById = async (req, res) => {
    try {
        const { type, id } = req.params;
        let response;
        switch (type) {
            case "ward": response = await locationService.getWardById(id); break;
            case "district": response = await locationService.getDistrictById(id); break;
            case "province": response = await locationService.getProvinceById(id); break;
        }
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getById
}