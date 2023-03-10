'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Message.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });
            Message.belongsTo(models.Conversation, { foreignKey: 'converId', targetKey: 'id', as: 'conver' });
        }
    }
    Message.init({
        message: DataTypes.STRING,
        image: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};