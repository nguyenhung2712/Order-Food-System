const { Reason } = require("../models");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Reason.findAll();
        resolve({
            status: "success",
            message: "Get all reason successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll
}