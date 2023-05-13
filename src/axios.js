import axios from 'axios';
import TokenService from "./app/services/token.service";
import { refreshToken } from "./app/redux/actions/AuthActions";

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    },
});

export const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = TokenService.getLocalAccessToken();

            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const { dispatch } = store;
    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;

            if (originalConfig.url !== "/auth/signin" && err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        const rs = await axiosInstance.post("/auth/refreshtoken", {
                            refreshToken: TokenService.getLocalRefreshToken(),
                        });
                        const { accessToken } = rs.data;

                        dispatch(refreshToken(accessToken));
                        TokenService.updateLocalAccessToken(accessToken);

                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};

export default axiosInstance;
