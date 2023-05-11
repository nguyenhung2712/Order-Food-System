'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            Conversation.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

            Conversation.hasMany(models.Message, { foreignKey: 'converId' });
            Conversation.hasMany(models.AdminConver, { foreignKey: 'converId' });

        }
    }
    Conversation.init({
        name: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT,
        slug: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Conversation',
    });
    return Conversation;
};