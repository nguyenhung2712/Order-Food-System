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
            Comment.hasMany(models.Interact, { foreignKey: 'commentId' });
            Comment.hasMany(models.Archive, { foreignKey: 'commentId' });
        }
    }
    Comment.init({
        message: DataTypes.STRING,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments'
    });
    return Comment;
};