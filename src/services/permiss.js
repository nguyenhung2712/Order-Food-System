const { Permission, Role_Permission } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes } = require('sequelize');
const sequelize = require("../../connectdb");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Permission.findAll();
        resolve({
            status: "success",
            message: "Get permissions successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (permissId) => new Promise(async (resolve, reject) => {
    try {
        const permiss = await Permission.findOne({
            where: { id: permissId }
        });
        resolve({
            status: "success",
            message: "Get permission successfully.",
            payload: permiss
        });
    } catch (error) {
        reject(error);
    }
});

const createPermiss = (permissBody) => new Promise(async (resolve, reject) => {
    try {
        await Permission.create(
            {
                id: uuidv4(),
                ...permissBody,
                deletedAt: null,
                status: 1,
                password: hash
            }
        )
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Create permission successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updatePermiss = (permissId, permissBody) => new Promise(async (resolve, reject) => {
    try {
        await Permission.update(
            { ...permissBody },
            { where: { id: permissId } }
        )
            .then(() => Permission.findByPk(permissId))
            .then(permission => {
                resolve({ 
                    status: "success",
                    message: "Update permission successfully.",
                    payload: permission
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deletePermiss = (permissId) => new Promise(async (resolve, reject) => {
    try {
        await Permission.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: permissId } }
        )
            .then(() => Permission.findByPk(permissId))
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Delete permission successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverPermiss = (permissId) => new Promise(async (resolve, reject) => {
    try {
        await Permission.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: permissId } }
        )
            .then(() => Permission.findByPk(permissId))
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Recover permission successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

const getPermissionByRoleId = (roleId) => new Promise(async (resolve, reject) => {

    try {
        let queryString = "select * from `permissions` " + 
            "where `name` in ( select p.name from " + 
            "`role_permissions` rp join permissions p " +
            "on p.id = rp.permissionId " + 
            `where roleId = '${roleId}')`;
        const permission = await sequelize.query(
            queryString, 
            { 
                raw: true,
                type: QueryTypes.SELECT,
            });
        resolve({ 
            status: "success",
            message: "Get role's permissions successfully.",
            payload: permission
        });
    } catch (error) {
        reject(error);
    }
});

const createRolePermission = (permissionId, roleId) => new Promise(async (resolve, reject) => {
    try {
        await Role_Permission.create(
            {
                permissionId, roleId,
                deletedAt: null,
                status: 1
            }
        )
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Create role's permissions successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteRolePermission = (permissionId, roleId) => new Promise(async (resolve, reject) => {
    try {
        await Role_Permission.destroy({ where: { permissionId, roleId } })
            .then(permiss => {
                resolve({ 
                    status: "success",
                    message: "Delete role's permissions successfully.",
                    payload: permiss
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    createPermiss,
    updatePermiss,
    deletePermiss,
    recoverPermiss,

    getPermissionByRoleId,
    createRolePermission,
    deleteRolePermission
}