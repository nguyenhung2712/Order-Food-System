'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ArchiveType extends Model {
        static associate(models) {
            ArchiveType.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }
    ArchiveType.init({
        title: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ArchiveType',
        tableName: 'archivetypes'
    });
    return ArchiveType;
};