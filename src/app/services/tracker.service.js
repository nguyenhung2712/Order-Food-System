import axiosInstance from "../../axios";

const getByAdminId = async (adminId) => {
    return await axiosInstance.get("/tracker/staff/" + adminId);
};

const getByUserId = async (userId) => {
    return await axiosInstance.get("/tracker/user/" + userId);
};

const getHistoryByUser = async (userId) => {
    return await axiosInstance.get("/tracker/history/user/" + userId);
};

const TrackerService = {
    getByAdminId,
    getByUserId,
    getHistoryByUser
};

export default TrackerService;