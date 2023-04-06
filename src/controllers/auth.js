const { authService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const login = async (req, res) => {
    try {
        const type = req.params.type;
        const { username, password } = req.body;
        const response = type === "user"
        ? await authService.userLogin(username, password)
        : await authService.staffLogin(username, password);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const userRegister = async (req, res) => {
    try {
        const response = await authService.userRegister(req.body)
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const staffRegister = async (req, res) => {
    try {
        const response = await authService.staffRegister(req.body);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const confirmMail = async (req, res) => {
    try {
        const { token, id } = req.params;
        const response = await authService.confirmMail(token, id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const staffProfile = async (req, res) => {
    try {
        const response = await authService.staffProfile(req.headers.authorization);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    userRegister,
    staffRegister,
    confirmMail,
    login,
    staffProfile
}