const { analyticService } = require('../services');

const getDashboardInfo = async (req, res) => {
    try {
        const response = await analyticService.getDashboardInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}
const getBlogInfo = async (req, res) => {
    try {
        const response = await analyticService.getBlogInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

const getOrderInfo = async (req, res) => {
    try {
        const response = await analyticService.getOrderInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

const getProductInfo = async (req, res) => {
    try {
        const response = await analyticService.getProductInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

const getBlogReportInfo = async (req, res) => {
    try {
        const response = await analyticService.getBlogReportInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

const getRatingReportInfo = async (req, res) => {
    try {
        const response = await analyticService.getRatingReportInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

const getCmtReportInfo = async (req, res) => {
    try {
        const response = await analyticService.getCmtReportInfo();
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

module.exports = {
    getDashboardInfo,
    getBlogInfo,
    getOrderInfo,
    getProductInfo,
    getBlogReportInfo,
    getRatingReportInfo,
    getCmtReportInfo
}