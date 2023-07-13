import axiosInstance from "../../axios";

const getAdminProfile = async (accessToken) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return axiosInstance.get("/auth/admin/profile");
}

const getAllStaffs = async (config) => {
    return await axiosInstance.get("/admin/all", config);
};

const getStaffById = async (staffId, config) => {
    return await axiosInstance.get("/admin/" + staffId, config);
};

const createStaff = async (staff) => {
    return await axiosInstance.post("/admin/create", staff);
};

const updateStaff = async (staffId, newInfo) => {
    return await axiosInstance.put("/admin/update/" + staffId, newInfo);
};

const deleteStaff = async (staffId) => {
    return await axiosInstance.put("/admin/delete/" + staffId);
};

const recoverStaff = async (staffId) => {
    return await axiosInstance.put("/admin/recover/" + staffId);
};

const removeStaff = async (staffId) => {
    return await axiosInstance.delete("/admin/remove/" + staffId);
};

const approveStaff = async (staffId) => {
    return await axiosInstance.put("/admin/approve/" + staffId);
}

const StaffService = {
    getAdminProfile,
    getAllStaffs,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    recoverStaff,
    removeStaff,
    approveStaff
};

export default StaffService;