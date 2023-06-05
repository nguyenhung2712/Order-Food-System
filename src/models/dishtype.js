'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DishType extends Model {
        static associate(models) {
            DishType.hasMany(models.Dish, { foreignKey: 'typeId' });
        }
    }
    DishType.init({
        typeName: DataTypes.STRING,
        typeNameEn: DataTypes.STRING,
        icon: DataTypes.STRING,
        unit: DataTypes.STRING,
        unitEn: DataTypes.STRING,
        slug: DataTypes.STRING,
        slugEn: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'DishType',
    });
    return DishType;
};