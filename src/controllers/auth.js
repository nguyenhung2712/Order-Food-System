const { authService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await authService.login(username, password);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const register = async (req, res) => {
    try {
        const response = await authService.register(req.body);
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

module.exports = {
    register,
    confirmMail,
    login
}