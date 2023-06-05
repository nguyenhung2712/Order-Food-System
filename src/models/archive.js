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
        }
    }
    Archive.init({}, {
        sequelize,
        modelName: 'Archive',
    });
    return Archive;
};