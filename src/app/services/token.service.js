const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        return user.refreshToken;
    }
    return null;
};

const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        return user.accessToken;
    }
    return null;
};

const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));;
};

const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const setUser = (user) => {
    /* console.log(JSON.stringify(user)); */
    localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
    localStorage.removeItem("user");
};

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
};

export default TokenService;