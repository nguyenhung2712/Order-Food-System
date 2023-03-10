'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Rate extends Model {
        static associate(models) {
            Rate.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            Rate.belongsTo(models.Dish, { foreignKey: 'dishId', targetKey: 'id', as: 'dish' });
        }
    }
    Rate.init({
        score: DataTypes.DECIMAL,
        remarks: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Rate',
    });
    return Rate;
};