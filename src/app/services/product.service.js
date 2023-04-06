import axiosInstance from "../../axios";

const getAllProducts = async () => {
    return await axiosInstance.get("/dish/all");
};

const getProductById = async (productId) => {
    return await axiosInstance.get("/dish/" + productId);
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
            headers: { 'Content-Type':'multipart/form-data' } 
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
    uploadImage
};

export default ProductService;