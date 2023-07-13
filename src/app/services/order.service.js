import axiosInstance from "../../axios";

const getAllOrders = async (config) => {
    return await axiosInstance.get("/order/all", config);
};

const getOrderById = async (orderId, config) => {
    return await axiosInstance.get("/order/" + orderId, config);
};

const getOrderByUser = async (userId) => {
    return await axiosInstance.get("/order/user/" + userId);
};

const createOrder = async (order) => {
    return await axiosInstance.post("/order/create", order);
};

const updateOrder = async (orderId, newInfo) => {
    return await axiosInstance.put("/order/update/" + orderId, newInfo);
};

const deleteOrder = async (orderId) => {
    return await axiosInstance.put("/order/delete/" + orderId);
};

const recoverOrder = async (orderId) => {
    return await axiosInstance.put("/order/recover/" + orderId);
};

const OrderService = {
    getAllOrders,
    getOrderById,
    getOrderByUser,
    createOrder,
    updateOrder,
    deleteOrder,
    recoverOrder
};

export default OrderService;