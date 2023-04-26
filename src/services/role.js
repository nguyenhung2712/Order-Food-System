const { v4: uuidv4 } = require("uuid");
const { Role, Admin_Role } = require("../models");
const { QueryTypes } = require('sequelize');
const sequelize = require("../../connectdb");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Role.findAll();
        resolve({
            status: "success",
            message: "Get roles successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (roleId) => new Promise(async (resolve, reject) => {
    try {
        const staff = await Role.findOne({
            where: { id: roleId }
        });
        resolve({
            status: "success",
            message: "Get role successfully.",
            payload: staff
        });
    } catch (error) {
        reject(error);
    }
});

const createRole = (roleBody) => new Promise(async (resolve, reject) => {
    try {
        await Role.create(
            {
                id: uuidv4(),
                ...roleBody,
                deletedAt: null,
                status: 1,
            }
        )
            .then(role => {
                resolve({
                    status: "success",
                    message: "Create role successfully.",
                    payload: role
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateRole = (roleId, roleBody) => new Promise(async (resolve, reject) => {
    try {
        await Role.update(
            { ...roleBody },
            { where: { id: roleId } }
        )
            .then(() => Role.findByPk(roleId))
            .then(role => {
                resolve({
                    status: "success",
                    message: "Update role successfully.",
                    payload: role
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteRole = (roleId) => new Promise(async (resolve, reject) => {
    try {
        await Role.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: roleId } }
        )
            .then(() => Role.findByPk(roleId))
            .then(role => {
                resolve({
                    status: "success",
                    message: "Delete role successfully.",
                    payload: role
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverRole = (roleId) => new Promise(async (resolve, reject) => {
    try {
        await Role.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: roleId } }
        )
            .then(() => Role.findByPk(roleId))
            .then(role => {
                resolve({
                    status: "success",
                    message: "Recover role successfully.",
                    payload: role
                });
            });
    } catch (error) {
        reject(error);
    }
});

const getAdminRoleByAdminId = (adminId) => new Promise(async (resolve, reject) => {
    try {
        let queryString = "select * from `roles` " +
            "where `name` in ( select r.name from " +
            "admin_roles ar join roles r " +
            "on r.id = ar.roleId " +
            `where adminId = '${adminId}')`;
        const roles = await sequelize.query(
            queryString,
            {
                raw: true,
                type: QueryTypes.SELECT,
            });
        resolve({
            status: "success",
            message: "Get admin's roles successfully.",
            payload: roles
        });
    } catch (error) {
        reject(error);
    }
});

const getOtherAdminRoleByAdminId = (adminId) => new Promise(async (resolve, reject) => {
    try {
        let queryString = "select * from `roles` " +
            "where name not in ( select r.name from " +
            "admin_roles ar join roles r " +
            "on r.id = ar.roleId " +
            `where adminId = '${adminId}')`;
        const roles = await sequelize.query(
            queryString,
            {
                raw: true,
                type: QueryTypes.SELECT,
            });
        resolve({
            status: "success",
            message: "Get admin's roles successfully.",
            payload: roles
        });
    } catch (error) {
        reject(error);
    }
});

const createAdminRole = (adminId, roleId) => new Promise(async (resolve, reject) => {
    try {
        await Admin_Role.create({
            adminId, roleId,
            AdminStaffId: adminId,
            RoleId: roleId,
            deletedAt: null,
            status: 1
        })
            .then(role => {
                resolve({
                    status: "success",
                    message: "Create admin's role successfully.",
                    payload: role
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteAdminRole = (adminId, roleId) => new Promise(async (resolve, reject) => {
    try {
        await Admin_Role.destroy(
            { where: { adminId, roleId } }
        )
            .then(res => {
                resolve({
                    status: "success",
                    message: "Delete admin's role successfully.",
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createRole,
    updateRole,
    deleteRole,
    recoverRole,
    getOtherAdminRoleByAdminId,
    getAdminRoleByAdminId,
    createAdminRole,
    deleteAdminRole,
}