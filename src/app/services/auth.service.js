import axiosInstance from "../../axios";
import TokenService from "./token.service";

const login = async (body) => {
    return await axiosInstance.post("/auth/login/staff", { ...body })
        .then((response) => {
            if (response.data.payload.accessToken) {
                TokenService.setUser(response.data.payload);
            }
            return response.data;
        });
}

const register = async (body) => {
    return await axiosInstance.post("/auth/register/staff", { ...body });
}

const AuthService = {
    login,
    register
};

export default AuthService;

/* const register = (user) => {
    return axiosInstance.post("/auth/login", { username, password });
} */