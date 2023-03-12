'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Like_Blog extends Model {
        static associate(models) {
            Like_Blog.belongsTo(models.User, { foreignKey: 'followedId', targetKey: 'id', as: 'followed' });
            Like_Blog.belongsTo(models.User, { foreignKey: 'followingId', targetKey: 'id', as: 'following' });
        }
    }
    Like_Blog.init({}, {
        sequelize,
        modelName: 'Like_Blog',
    });
    return Like_Blog;
};