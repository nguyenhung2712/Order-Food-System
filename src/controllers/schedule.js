const { scheduleService } = require('../services');

const getAllType = async (req, res) => {
    try {
        const response = await scheduleService.getAllType();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getAll = async (req, res) => {
    try {
        const response = await scheduleService.getAll();
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const createSchedule = async (req, res) => {
    try {
        const response = await scheduleService.createSchedule(req.body);
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const updateSchedule = async (req, res) => {
    try {
        const response = await scheduleService.updateSchedule(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

const deleteSchedule = async (req, res) => {
    try {
        const response = await scheduleService.deleteSchedule(req.params.id);
        return res.json(response);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

module.exports = {
    getAll,
    getAllType,
    createSchedule,
    updateSchedule,
    deleteSchedule
}