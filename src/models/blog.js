'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        static associate(models) {

            Blog.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

            Blog.hasMany(models.Interact, { foreignKey: 'blogId' });
            Blog.hasMany(models.Comment, { foreignKey: 'blogId' });
            Blog.hasMany(models.History, { foreignKey: 'blogId' });
            Blog.hasMany(models.Archive, { foreignKey: 'blogId' });
        }
    }
    Blog.init({
        header: DataTypes.STRING,
        content: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT,
        slug: DataTypes.STRING,
        views: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Blog',
    });
    return Blog;
};