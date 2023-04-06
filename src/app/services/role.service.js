import axiosInstance from "../../axios";

const getAllRoles = async () => {
    return await axiosInstance.get("/role/all");
};

const getRoleById = async (roleId) => {
    return await axiosInstance.get("/role/" + roleId);
};

const createRole = async (role) => {
    return await axiosInstance.post("/role/create", role);
};

const updateRole = async (roleId, newInfo) => {
    return await axiosInstance.put("/role/update/" + roleId, newInfo);
};

const deleteRole = async (roleId) => {
    return await axiosInstance.put("/role/delete/" + roleId);
};

const recoverRole = async (roleId) => {
    return await axiosInstance.put("/role/recover/" + roleId);
};

const getRolesByAdminId = async (adminId) => {
    return await axiosInstance.get("/role/staff-role/" + adminId);
}

const getOtherRolesByAdminId = async (adminId) => {
    return await axiosInstance.get("/role/staff-other-role/" + adminId);
}

const createRoleForAdmin = async (adminId, roleId) => {
    return await axiosInstance.post("/role/staff-role/create" , {
        adminId, roleId
    });
} 

const deleteRoleForAdmin = async (adminId, roleId) => {
    return await axiosInstance.post("/role/staff-role/delete" , {
        adminId, roleId
    });
} 

const recoverRoleForAdmin = async (adminId, roleId) => {
    return await axiosInstance.post("/role/staff-role/recover" , {
        adminId, roleId
    });
} 

const RoleService = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    recoverRole,
    getRolesByAdminId,
    getOtherRolesByAdminId,
    createRoleForAdmin,
    deleteRoleForAdmin,
    recoverRoleForAdmin
};

export default RoleService;