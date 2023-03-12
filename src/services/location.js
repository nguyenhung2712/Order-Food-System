const { Ward, District, Province } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getWardById = (wardId) => new Promise(async (resolve, reject) => {
    try {
        const ward = await Ward.findOne({
            where: { id: wardId }
        });
        resolve({
            status: "success",
            message: "Get ward successfully.",
            payload: ward
        });
    } catch (error) {
        reject(error);
    }
});

const getDistrictById = (districtId) => new Promise(async (resolve, reject) => {
    try {
        const district = await District.findOne({
            where: { id: districtId }
        });
        resolve({
            status: "success",
            message: "Get district successfully.",
            payload: district
        });
    } catch (error) {
        reject(error);
    }
});

const getProvinceById = (wardId) => new Promise(async (resolve, reject) => {
    try {
        const ward = await Province.findOne({
            where: { id: wardId }
        });
        resolve({
            status: "success",
            message: "Get ward successfully.",
            payload: ward
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getWardById,
    getDistrictById,
    getProvinceById
}