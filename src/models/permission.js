'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            Permission.hasMany(models.Role_Permission, { foreignKey: 'permissionId' });
        }
    }
    Permission.init({
        name: DataTypes.STRING,
        describe: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions'
    });
    return Permission;
};