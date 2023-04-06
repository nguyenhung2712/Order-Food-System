import axiosInstance from "../../axios";

const getAllPermisss = async () => {
    return await axiosInstance.get("/permiss/all");
};

const getPermissById = async (permissId) => {
    return await axiosInstance.get("/permiss/" + permissId);
};

const createPermiss = async (permiss) => {
    return await axiosInstance.post("/permiss/create", permiss);
};

const updatePermiss = async (permissId, newInfo) => {
    return await axiosInstance.put("/permiss/update/" + permissId, newInfo);
};

const deletePermiss = async (permissId) => {
    return await axiosInstance.put("/permiss/delete/" + permissId);
};

const recoverPermiss = async (permissId) => {
    return await axiosInstance.put("/permiss/recover/" + permissId);
};

const getPermissByRoleId = async (roleId) => {
    return await axiosInstance.get("/permiss/role-permiss/" + roleId);
}

const createPermissForRole = async (permissId, roleId) => {
    return await axiosInstance.post("/permiss/role-permiss/create" , {
        permissId, roleId
    });
} 

const deletePermissForRole = async (permissId, roleId) => {
    return await axiosInstance.post("/permiss/role-permiss/delete" , {
        permissId, roleId
    });
} 

const PermissService = {
    getAllPermisss,
    getPermissById,
    createPermiss,
    updatePermiss,
    deletePermiss,
    recoverPermiss,
    
    getPermissByRoleId,
    createPermissForRole,
    deletePermissForRole
};

export default PermissService;