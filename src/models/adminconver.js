'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminConver extends Model {
        static associate(models) {
            AdminConver.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });
            AdminConver.belongsTo(models.Conversation, { foreignKey: 'converId', targetKey: 'id', as: 'conver' });
        }
    }
    AdminConver.init({}, {
        sequelize,
        modelName: 'AdminConver',
    });
    AdminConver.removeAttribute("id");

    return AdminConver;
};