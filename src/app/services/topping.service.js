import axiosInstance from "../../axios";

const getAllToppings = async () => {
    return await axiosInstance.get("/topping/all");
};

const createDishTopping = async (dishId, tppId) => {
    return await axiosInstance.post("/topping/dish-topping/create", {
        dishId, toppingId: tppId
    });
};

const deleteDishTopping = async (dishId, tppId) => {
    return await axiosInstance.post("/topping/dish-topping/delete", {
        dishId, toppingId: tppId
    });
};

/* const getToppingById = async (toppingId) => {
    return await axiosInstance.get("/topping/" + toppingId);
};

const createTopping = async (topping) => {
    return await axiosInstance.post("/topping/create", topping);
};

const updateTopping = async (toppingId, newInfo) => {
    return await axiosInstance.put("/topping/update/" + toppingId, newInfo);
};

const deleteTopping = async (toppingId) => {
    return await axiosInstance.put("/topping/delete/" + toppingId);
}; */

const ToppingService = {
    getAllToppings,
    createDishTopping,
    deleteDishTopping
    /* getToppingById,
    createTopping,
    updateTopping,
    deleteTopping, */
};

export default ToppingService;