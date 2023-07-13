'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Region extends Model {
        static associate(models) {
            Region.hasMany(models.Province, { foreignKey: 'regionId' });
        }
    }
    Region.init({
        regionName: DataTypes.STRING,
        regionNameEn: DataTypes.STRING,
        codeNameEn: DataTypes.STRING,
        codeName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Region',
        tableName: 'regions',
        timestamps: false
    });
    return Region;
};