import axiosInstance from "../../axios";

const getHistoryByUser = async (userId, config) => {
    return await axiosInstance.get("/tracker/history/user/" + userId, config);
};

const TrackerService = {
    getHistoryByUser
};

export default TrackerService;