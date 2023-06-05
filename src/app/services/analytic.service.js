import axiosInstance from "../../axios";

const getDbAnalytics = async () => {
    return await axiosInstance.get("/analytic/dashboard");
};

const getBlogAnalytics = async () => {
    return await axiosInstance.get("/analytic/blog");
};

const getOrderAnalytics = async () => {
    return await axiosInstance.get("/analytic/order");
};

const getReportInfo = async () => {
    return await axiosInstance.get("/analytic/report");
};

const AnalyticService = {
    getDbAnalytics,
    getBlogAnalytics,
    getReportInfo,
    getOrderAnalytics
};

export default AnalyticService;