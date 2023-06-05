const { reasonService } = require('../services');

const getAll = async (req, res) => {
    try {
        const response = await reasonService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll
}