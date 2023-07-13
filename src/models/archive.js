'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Archive extends Model {
        static associate(models) {
            Archive.belongsTo(models.Blog, { foreignKey: 'blogId', targetKey: 'id', as: 'blog' });
            Archive.belongsTo(models.ArchiveType, { foreignKey: 'typeId', targetKey: 'id', as: 'type' });
            Archive.belongsTo(models.AdminStaff, { foreignKey: 'adminId', targetKey: 'id', as: 'admin' });
            Archive.belongsTo(models.Rate, { foreignKey: 'ratingId', targetKey: 'id', as: 'rate' });
            Archive.belongsTo(models.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'cmt' });
            Archive.belongsTo(models.CommentRep, { foreignKey: 'repId', targetKey: 'id', as: 'rep' });
        }
    }
    Archive.init({}, {
        sequelize,
        modelName: 'Archive',
        tableName: 'archives'
    });
    return Archive;
};