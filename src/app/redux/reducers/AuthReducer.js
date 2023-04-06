import AuthActionTypes from "../constants/AuthActionTypes";

const user = JSON.parse(localStorage.getItem("user"));
    
const initialState = {
    isAuthenticated: user ? true : false,
    isInitialised: user ? true : false,
    user: user ? user : null,
}

export const tokenReducer = (state = initialState, { type, payload }) => {

    switch (type) {
        case AuthActionTypes.REFRESH_TOKEN:
            return {
                ...state,
                user: { ...user, accessToken: payload },
            };
        default:
            return state;
    }
}

export const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case AuthActionTypes.INIT: {
            const { isAuthenticated, user } = payload;
            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case AuthActionTypes.LOGIN: {
            const { user } = payload;
            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case AuthActionTypes.LOGOUT: {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case AuthActionTypes.REGISTER: {
            const { user } = payload;

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}