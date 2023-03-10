const { userService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getAll = async (req, res) => {
    try {
        const response = await userService.getAll();
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const response = await userService.getUser(id);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const response = await userService.changePassword(req.params.id, newPassword, oldPassword);
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getAll,
    getUser,
    changePassword
}