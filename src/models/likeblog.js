'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Like_Blog extends Model {
        static associate(models) {
            Like_Blog.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Like_Blog.belongsTo(models.Blog, { foreignKey: 'blogId', targetKey: 'id', as: 'blog' });
        }
    }
    Like_Blog.init({
        type: DataTypes.TINYINT,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Like_Blog',
    });
    return Like_Blog;
};