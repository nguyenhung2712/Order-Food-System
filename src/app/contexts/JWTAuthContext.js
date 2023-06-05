import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { MatxLoading } from '../components';
import AuthService from '../services/auth.service';
import TokenService from '../services/token.service';
import StaffService from '../services/staff.service';
import { authReducer } from '../redux/reducers/AuthReducer';
import { login, logout, init } from '../redux/actions/AuthActions';
import { addDocument, insertField } from '../services/firebase/service';

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
    logout: () => { },
    register: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();
    const signin = async (username, password) => {
        const response = await AuthService.login({ username, password });
        const { staff } = response.payload;
        dispatch(login(staff));
        navigate("/");
    }

    const signup = async (email, username, password) => {
        const response = await AuthService.register({ username, email, password });
        const { staff } = response.data;
        /* addDocument("staffs", {
            email: staff.email,
            id: staff.id
        });
        insertField("rooms", {
            email: staff.email,
            id: staff.id
        }); */
    }

    const signout = () => {
        localStorage.removeItem("user");

        dispatch(logout());
    }

    useEffect(() => {
        (async () => {
            try {
                const accessToken = TokenService.getLocalAccessToken();
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
    }, []);

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
                signup
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext
