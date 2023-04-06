'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminStaff extends Model {
        static associate(models) {
            AdminStaff.hasMany(models.Admin_Role, { foreignKey: 'adminId' });
			AdminStaff.hasMany(models.Conversation, { foreignKey: 'adminId' });
			AdminStaff.hasMany(models.Message, { foreignKey: 'adminId' });
			AdminStaff.hasMany(models.Tracker, { foreignKey: 'adminId' });
        }
    }
    AdminStaff.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        fullname: DataTypes.STRING,
        email: DataTypes.STRING,
        lastLogin: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
        disabledAt: DataTypes.DATE,
        isActived: DataTypes.INTEGER,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'AdminStaff',
    });
    return AdminStaff;
};