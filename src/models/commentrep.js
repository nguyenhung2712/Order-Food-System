'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CommentRep extends Model {
        static associate(models) {
            CommentRep.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            CommentRep.belongsTo(models.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });
            CommentRep.belongsTo(CommentRep, { foreignKey: 'repId', targetKey: 'id', as: 'rep' });

            CommentRep.hasMany(models.Interact, { foreignKey: 'repId' });
            CommentRep.hasMany(models.Archive, { foreignKey: 'repId' });
        }
    }
    CommentRep.init({
        message: DataTypes.STRING,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'CommentRep',
        tableName: 'commentreps'
    });
    return CommentRep;
};