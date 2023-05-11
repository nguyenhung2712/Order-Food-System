const { authService } = require('../services');

const login = async (req, res) => {
    try {
        const type = req.params.type;
        const { username, password } = req.body;
        const response = type === "user"
            ? await authService.userLogin(username, password)
            : await authService.staffLogin(username, password);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const userRegister = async (req, res) => {
    try {
        const response = await authService.userRegister(req.body)
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const staffRegister = async (req, res) => {
    try {
        const response = await authService.staffRegister(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const confirmMail = async (req, res) => {
    try {
        const { token, id } = req.params;
        const response = await authService.confirmMail(token, id);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const userLoginVerifyOTP = async (req, res) => {
    try {
        const response = await authService.userLoginVerifyOTP({ ...req.body });
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const userFPVerifyOTP = async (req, res) => {
    try {
        const response = await authService.userFPVerifyOTP({ ...req.body });
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const sendOTP = async (req, res) => {
    try {
        const response = await authService.sendOTP({ ...req.body });
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

const forgetPassword = async (req, res) => {
    try {
        const response = await authService.forgetPassword({ ...req.body });
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const staffProfile = async (req, res) => {
    try {
        const response = await authService.staffProfile(req.headers.authorization);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const refreshToken = async (req, res) => {
    try {
        const response = await authService.refreshToken(req.body.refreshToken);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

module.exports = {
    userRegister,
    staffRegister,
    confirmMail,
    userLoginVerifyOTP,
    userFPVerifyOTP,
    sendOTP,
    forgetPassword,
    login,
    staffProfile,
    refreshToken,
}