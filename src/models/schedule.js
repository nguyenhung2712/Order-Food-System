'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            Schedule.hasMany(models.AdminSchedule, { foreignKey: 'scheduleId' });
            Schedule.belongsTo(models.ScheduleType, { foreignKey: 'typeId', targetKey: 'id', as: 'type' });
        }
    }
    Schedule.init({
        end: DataTypes.STRING,
        color: DataTypes.STRING,
        start: DataTypes.STRING,
        title: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};