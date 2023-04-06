const { v4: uuidv4 } = require("uuid");
const { Tracker } = require("../models");

const getTrackersByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Tracker.findAll({ where: { adminId: userId} });
        resolve({ 
            status: "success",
            message: "Get activity track successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getTrackersByAdminId = (adminId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Tracker.findAll({ where: { adminId: adminId} });
        resolve({ 
            status: "success",
            message: "Get activity track successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getTrackersByUserId,
    getTrackersByAdminId
}