import axiosInstance from "../../axios";

const getAllProductTypes = async () => {
    return await axiosInstance.get("/dish-type/all");
};

const getProductTypeById = async (typeId) => {
    return await axiosInstance.get("/dish-type/" + typeId);
};

const createProductType = async (product) => {
    return await axiosInstance.post("/dish-type/create", product);
};

const updateProductType = async (typeId, newInfo) => {
    return await axiosInstance.put("/dish-type/update/" + typeId, newInfo);
};

const deleteProductType = async (typeId) => {
    return await axiosInstance.put("/dish-type/delete/" + typeId);
};

const recoverProductType = async (typeId) => {
    return await axiosInstance.put("/dish-type/recover/" + typeId);
};

const ProductTypeService = {
    getAllProductTypes,
    getProductTypeById,
    createProductType,
    updateProductType,
    deleteProductType,
    recoverProductType
};

export default ProductTypeService;