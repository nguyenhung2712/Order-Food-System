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
        typeName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'DishType',
    });
    return DishType;
};