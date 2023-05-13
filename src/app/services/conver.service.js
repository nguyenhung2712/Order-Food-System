import axiosInstance from "../../axios";

const getAllConvers = async () => {
    return await axiosInstance.get("/conver/all");
};

const getConverById = async (converId) => {
    return await axiosInstance.get("/conver/" + converId);
};

const createConver = async (conver) => {
    return await axiosInstance.post("/conver/create", conver);
};

const updateConver = async (converId, newInfo) => {
    return await axiosInstance.put("/conver/update/" + converId, newInfo);
};

const ConverService = {
    getAllConvers,
    getConverById,
    createConver,
    updateConver
};

export default ConverService;