'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Unit extends Model {
        static associate(models) {
            Unit.hasMany(models.Province, { foreignKey: 'unitId' });
            Unit.hasMany(models.Ward, { foreignKey: 'unitId' });
            Unit.hasMany(models.District, { foreignKey: 'unitId' });
        }
    }
    Unit.init({
        unitName: DataTypes.STRING,
        unitNameEn: DataTypes.STRING,
        codeNameEn: DataTypes.STRING,
        codeName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Unit',
        tableName: 'units',
        timestamps: false
    });
    return Unit;
};