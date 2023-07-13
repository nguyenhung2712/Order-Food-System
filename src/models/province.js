'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        static associate(models) {
            Province.hasMany(models.Address, { foreignKey: 'provinceId' });
            Province.hasMany(models.District, { foreignKey: 'provinceId' });
            Province.belongsTo(models.Region, { foreignKey: 'regionId', targetKey: 'id', as: 'region' });
            Province.belongsTo(models.Unit, { foreignKey: 'unitId', targetKey: 'id', as: 'unit' });
        }
    }
    Province.init({
        provinceName: DataTypes.STRING,
        provinceNameEn: DataTypes.STRING,
        fullname: DataTypes.STRING,
        fullnameEn: DataTypes.STRING,
        codeName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Province',
        tableName: 'provinces',
        timestamps: false
    });
    return Province;
};