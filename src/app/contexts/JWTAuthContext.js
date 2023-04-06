import React, { createContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { MatxLoading } from '../components';
import AuthService from '../services/auth.service';
import StaffService from '../services/staff.service';
import { authReducer } from '../redux/reducers/AuthReducer';
import { login, logout, init } from '../redux/actions/AuthActions';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
}

/* const setSession = (accessToken, refreshToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common.Authorization;
    }
} */

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => {},
    register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const signin = async (username, password) => {
        const response = await AuthService.login({ username, password });
        const { staff } = response.payload;
        dispatch(login(staff));
    }

    const authRegister = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        });
        const { user } = response.data;
        dispatch(authRegister(user));
    }

    const signout = () => {
        localStorage.removeItem("user");

        dispatch(logout());
    }

    useEffect(() => {
       
        ; (async () => {
            try {
                const accessToken = JSON.parse(window.localStorage.getItem('user'))?.accessToken;
                if (accessToken && isValidToken(accessToken)) {
                    const response = await StaffService.getAdminProfile(accessToken);
                    const staff = response.data.payload.staff;
                    dispatch(init(true, staff));
                } else {
                    dispatch(init(false, null));
                }
            } catch (err) {
                console.error(err);
                dispatch(init(false, null));
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />;
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                signin,
                signout,
                authRegister,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext
