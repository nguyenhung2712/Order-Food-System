'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminSchedule extends Model {
        static associate(models) {
            AdminSchedule.belongsTo(models.Schedule, { foreignKey: 'scheduleId', targetKey: 'id', as: 'schedule' });
            AdminSchedule.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });
        }
    }
    AdminSchedule.init({}, {
        sequelize,
        modelName: 'AdminSchedule',
        tableName: 'adminschedules'
    });
    return AdminSchedule;
};