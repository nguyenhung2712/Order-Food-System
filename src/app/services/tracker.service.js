import axiosInstance from "../../axios";

const getByAdminId = async (adminId) => {
    return await axiosInstance.get("/tracker/staff/" + adminId);
};

const getByUserId = async (userId) => {
    return await axiosInstance.get("/tracker/user/" + userId);
};

const TrackerService = {
    getByAdminId,
    getByUserId,
};

export default TrackerService;