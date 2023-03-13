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

const getWardsByDistrictId = (districtId) => new Promise(async (resolve, reject) => {
    try {
        const wards = await Ward.findAll({
            where: { districtId }
        });
        resolve({
            status: "success",
            message: "Get wards successfully.",
            payload: wards
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

const getDistrictsByProvinceId = (provinceId) => new Promise(async (resolve, reject) => {
    try {
        const districts = await District.findAll({
            where: { provinceId }
        });
        resolve({
            status: "success",
            message: "Get districts successfully.",
            payload: districts
        });
    } catch (error) {
        reject(error);
    }
});

const getProvinceById = (provinceId) => new Promise(async (resolve, reject) => {
    try {
        const province = await Province.findOne({
            where: { id: provinceId }
        });
        resolve({
            status: "success",
            message: "Get province successfully.",
            payload: province
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getWardById,
    getWardsByDistrictId,
    getDistrictById,
    getDistrictsByProvinceId,
    getProvinceById,
}