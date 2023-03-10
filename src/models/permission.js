'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            Permission.belongsToMany(models.Role, { through: 'Role_Permissions' });
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
    });
    return Permission;
};