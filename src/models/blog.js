'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        static associate(models) {
            Blog.belongsToMany(models.User, { through: 'Like_Blog' });

            Blog.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

			Blog.hasMany(models.Comment, { foreignKey: 'blogId' });
        }
    }
    Blog.init({
        header: DataTypes.STRING,
        content: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT,
        publishedTime: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Blog',
    });
    return Blog;
};