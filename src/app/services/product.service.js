import axiosInstance from "../../axios";

const getStatisticInfo = async (productId) => {
    return await axiosInstance.get("/dish/statistic/" + productId);
};

const getAllProducts = async (config) => {
    return await axiosInstance.get("/dish/all", config);
};

const getProductById = async (productId, config) => {
    return await axiosInstance.get("/dish/" + productId, config);
};

const createProduct = async (product) => {
    return await axiosInstance.post("/dish/create", product);
};

const updateProduct = async (productId, newInfo) => {
    return await axiosInstance.put("/dish/update/" + productId, newInfo);
};

const uploadImage = async (id, formData) => {
    return await axiosInstance.post("/dish/upload-image/" + id,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
};

const deleteProduct = async (productId) => {
    return await axiosInstance.put("/dish/delete/" + productId);
};

const recoverProduct = async (productId) => {
    return await axiosInstance.put("/dish/recover/" + productId);
};

const ProductService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    recoverProduct,
    uploadImage,
    getStatisticInfo
};

export default ProductService;