const bcrypt = require("bcrypt");

const { Token } = require("../models");
const userService = require("./user");

const getToken = (token) => new Promise(async (resolve, reject) => {
    try {
        const response = await Token.findOne({ where: { token: token } });
        if (!response) {
            reject({ 
                status: "error",
                message: "Doesn't Exist!" 
            });
        } else {
            resolve({ 
                status: "success",
                message: "Get token successfully.",
                payload: response
            });
        }
    } catch (error) {
        reject(error);
    }
});



module.exports = {
    getToken,
}