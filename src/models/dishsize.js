'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DishSize extends Model {
        static associate(models) {
            DishSize.hasMany(models.DishHasSize, { foreignKey: 'sizeId' });
        }
    }
    DishSize.init({
        size: DataTypes.STRING,
        sizeEn: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'DishSize',
    });
    return DishSize;
};