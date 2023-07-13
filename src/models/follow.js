'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Follow extends Model {
        static associate(models) {
            Follow.belongsTo(models.User, { foreignKey: 'followingId', targetKey: 'id', as: 'following' });
            Follow.belongsTo(models.User, { foreignKey: 'followedId', targetKey: 'id', as: 'follower' });
        }
    }
    Follow.init({}, {
        sequelize,
        modelName: 'Follow',
        tableName: 'follows'
    });
    return Follow;
};