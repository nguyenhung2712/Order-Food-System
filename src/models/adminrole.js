'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin_Role extends Model {
        static associate(models) {
            Admin_Role.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });
            Admin_Role.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id', as: 'role' });
        }
    }
    Admin_Role.init({
        
    }, {
        sequelize,
        modelName: 'Admin_Role',
    });
    Admin_Role.removeAttribute("id");
    return Admin_Role;
};