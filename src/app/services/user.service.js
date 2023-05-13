import axiosInstance from "../../axios";

const getAllUsers = async () => {
    return await axiosInstance.get("/user/all");
};

const getUserById = async (userId) => {
    return await axiosInstance.get("/user/" + userId);
};

const createUser = async (user) => {
    return await axiosInstance.post("/user/create", user);
};

const updateUser = async (userId, newInfo) => {
    return await axiosInstance.put("/user/update/" + userId, newInfo);
};

const uploadAvatar = async (id, formData) => {
    return await axiosInstance.put("/user/upload-avatar/" + id,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
};

/* const deleteUser = async (userId) => {
    return await axiosInstance.put("/user/delete/" + userId);
};

const recoverUser = async (userId) => {
    return await axiosInstance.put("/user/recover/" + userId);
}; */

const UserService = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    uploadAvatar,
    /* deleteUser,
    recoverUser */
};

export default UserService;