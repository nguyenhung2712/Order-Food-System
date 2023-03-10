'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            Conversation.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });

            Conversation.hasOne(models.User);

			Conversation.hasMany(models.Message, { foreignKey: 'converId' });
        }
    }
    Conversation.init({
        name: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Conversation',
    });
    return Conversation;
};