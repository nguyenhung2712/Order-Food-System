import axiosInstance from "../../axios";

const getDbAnalytics = async (config) => {
    return await axiosInstance.get("/analytic/dashboard", config);
};

const getBlogAnalytics = async (config) => {
    return await axiosInstance.get("/analytic/blog", config);
};

const getOrderAnalytics = async (config) => {
    return await axiosInstance.get("/analytic/order", config);
};

const getBlogReportInfo = async (config) => {
    return await axiosInstance.get("/analytic/report/blog", config);
};

const getRatingReportInfo = async (config) => {
    return await axiosInstance.get("/analytic/report/rating", config);
};

const getProductAnalytics = async (config) => {
    return await axiosInstance.get("/analytic/product", config);
};

const AnalyticService = {
    getDbAnalytics,
    getBlogAnalytics,
    getOrderAnalytics,
    getProductAnalytics,
    getBlogReportInfo,
    getRatingReportInfo
};

export default AnalyticService;