import axiosInstance from "../../axios";

const createDetail = async (detail) => {
    return await axiosInstance.post("/order-detail/create", detail);
};

const DetailService = {
    createDetail,
};

export default DetailService;