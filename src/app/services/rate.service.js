import axiosInstance from "../../axios";

const getRatingById = async (dishId) => {
    return await axiosInstance.get("/rate/dish/" + dishId);
};

const getRatingWithPaginate = async (dishId, page, limit) => {
    return await axiosInstance.get("/rate/paginate/dish/" + dishId + `?page=${page}&limit=${limit}`);
};

const deleteRating = async (rateId) => {
    return await axiosInstance.delete("/rate/delete/" + rateId);
};

const getAllReports = async (config) => {
    return await axiosInstance.get("/rate/reports", config);
};

const deleteReport = async (reportId) => {
    return await axiosInstance.delete("/rate/report/delete/" + reportId);
};

const solveReport = async (ratingId, userId) => {
    return await axiosInstance.put("/rate/report/solve", {
        userId, ratingId
    });
};

const RatingService = {
    getRatingById,
    getRatingWithPaginate,
    deleteRating,
    getAllReports,
    deleteReport,
    solveReport
};

export default RatingService;