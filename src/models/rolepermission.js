'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role_Permission extends Model {
        static associate(models) {
            Role_Permission.belongsTo(models.Permission, { foreignKey: 'permissionId', targetKey: 'id', as: 'permission' });
            Role_Permission.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
        }
    }
    Role_Permission.init({}, {
        sequelize,
        modelName: 'Role_Permission',
    });
    return Role_Permission;
};