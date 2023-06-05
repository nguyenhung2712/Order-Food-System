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

const getReportInfo = async (req, res) => {
    try {
        const response = await analyticService.getReportInfo();
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
    getReportInfo
}