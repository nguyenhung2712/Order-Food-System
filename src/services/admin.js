const { AdminStaff } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await AdminStaff.findAll();
        resolve({
            status: "success",
            message: "Get staffs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (staffId) => new Promise(async (resolve, reject) => {
    try {
        const staff = await AdminStaff.findOne({
            where: { id: staffId }
        });
        resolve({
            status: "success",
            message: "Get staff successfully.",
            payload: staff
        });
    } catch (error) {
        reject(error);
    }
});

const createStaff = (password, staffBody) => new Promise(async (resolve, reject) => {
    try {
        bcrypt.hash(password, 10).then(async (hash) => {
            await AdminStaff.create(
                {
                    id: uuidv4(),
                    ...staffBody,
                    deletedAt: null,
                    status: 1,
                    password: hash
                }
            )
                .then(staff => {
                    resolve({ 
                        status: "success",
                        message: "Create staff successfully.",
                        payload: staff
                    });
                });
        });
        
    } catch (error) {
        reject(error);
    }
});

const updateStaff = (staffId, staffBody) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            { ...staffBody },
            { where: { id: staffId } }
        )
            .then(staff => {
                resolve({ 
                    status: "success",
                    message: "Update staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteStaff = (staffId) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: staffId } }
        )
            .then(staff => {
                resolve({ 
                    status: "success",
                    message: "Delete staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverStaff = (staffId) => new Promise(async (resolve, reject) => {
    try {
        await AdminStaff.update(
            {
                deletedAt: null,
                status: 1
            },
            { where: { id: staffId } }
        )
            .then(staff => {
                resolve({ 
                    status: "success",
                    message: "Recover staff successfully.",
                    payload: staff
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createStaff,
    updateStaff,
    deleteStaff,
    recoverStaff
}