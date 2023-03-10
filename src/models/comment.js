'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Comment.belongsTo(models.Blog, { foreignKey: 'blogId', targetKey: 'id', as: 'blog' });

			Comment.hasMany(models.CommentRep, { foreignKey: 'commentId' });
        }
    }
    Comment.init({
        message: DataTypes.STRING,
        image: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};