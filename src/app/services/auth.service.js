import axiosInstance from "../../axios";
import TokenService from "./token.service";

const login = async ({ username, password }) => {
    return await axiosInstance.post("/auth/login/admin", { username, password })
        .then((response) => {
            if (response.data.payload.accessToken) {
				TokenService.setUser(response.data.payload);
			}
			return response.data;
        });
}

const AuthService = {
    login
};

export default AuthService;

/* const register = (user) => {
    return axiosInstance.post("/auth/login", { username, password });
} */