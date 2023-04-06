import AuthActionTypes from "../constants/AuthActionTypes";

export const refreshToken = (accessToken) => {
    return {
        type: AuthActionTypes.REFRESH_TOKEN,
        payload: accessToken,
    };
}

export const init = (isAuthenticated, user) => {
    return {
        type: AuthActionTypes.INIT,
        payload: { isAuthenticated, user },
    }
}

export const register = (user) => {
    return {
        type: AuthActionTypes.REGISTER,
        payload: { user },
    };
}

export const login = (user) => {
    return {
        type: AuthActionTypes.LOGIN,
        payload: { user },
    };
}

export const logout = () => {
    return { type: AuthActionTypes.LOGOUT };
}
 