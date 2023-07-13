'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ScheduleType extends Model {
        static associate(models) {
            ScheduleType.hasMany(models.Schedule, { foreignKey: 'typeId' });
        }
    }
    ScheduleType.init({
        typeName: DataTypes.STRING,
        icon: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ScheduleType',
        tableName: 'scheduletypes'
    });
    return ScheduleType;
};