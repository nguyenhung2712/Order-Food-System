'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.hasMany(models.Admin_Role, { foreignKey: 'roleId' });
            Role.hasMany(models.Role_Permission, { foreignKey: 'roleId' });
        }
    }
    Role.init({
        name: DataTypes.STRING,
        describe: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles'
    });
    return Role;
};