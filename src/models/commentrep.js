'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CommentRep extends Model {
        static associate(models) {
            CommentRep.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            CommentRep.belongsTo(models.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });
        }
    }
    CommentRep.init({
        message: DataTypes.STRING,
        image: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'CommentRep',
    });
    return CommentRep;
};