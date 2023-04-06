'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tracker extends Model {
        static associate(models) {
            Tracker.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });
            Tracker.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }
    Tracker.init({
        statusCode: DataTypes.STRING,
        apiText: DataTypes.STRING,
        ipAddress: DataTypes.STRING,
        typeApi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Tracker',
    });
    return Tracker;
};