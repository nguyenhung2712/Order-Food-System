'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        static associate(models) {
            Province.hasMany(models.Address, { foreignKey: 'provinceId' });
            Province.hasMany(models.District, { foreignKey: 'provinceId' });
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
        timestamps: false
    });
    return Province;
};