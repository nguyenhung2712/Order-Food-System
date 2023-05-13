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

const RatingService = {
    getRatingById,
    getRatingWithPaginate,
    deleteRating,
};

export default RatingService;