'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminStaff extends Model {
        static associate(models) {
            AdminStaff.belongsToMany(models.Role, { through: 'Admin_Role' });

			AdminStaff.hasMany(models.Conversation, { foreignKey: 'adminId' });
			AdminStaff.hasMany(models.Message, { foreignKey: 'adminId' });
        }
    }
    AdminStaff.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        fullname: DataTypes.STRING,
        lastLogin: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'AdminStaff',
    });
    return AdminStaff;
};