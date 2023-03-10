'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsToMany(models.AdminStaff, { through: 'Admin_Role' });
            Role.belongsToMany(models.Permission, { through: 'Role_Permissions' });
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
    });
    return Role;
};