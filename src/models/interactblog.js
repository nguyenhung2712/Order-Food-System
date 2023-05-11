'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InteractBlog extends Model {
        static associate(models) {
            InteractBlog.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            InteractBlog.belongsTo(models.Blog, { foreignKey: 'blogId', targetKey: 'id', as: 'blog' });
        }
    }
    InteractBlog.init({
        type: DataTypes.TINYINT,
        reason: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'InteractBlog',
    });
    return InteractBlog;
};