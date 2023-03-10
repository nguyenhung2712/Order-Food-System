'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }
    Notification.init({
        sentTime: DataTypes.DATE,
        isRead: DataTypes.TINYINT,
        checkTime: DataTypes.DATE,
        notifyType: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT,
        title: DataTypes.STRING,
        content: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};