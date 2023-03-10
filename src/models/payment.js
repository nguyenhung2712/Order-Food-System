'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.hasOne(models.Order);
        }
    }
    Payment.init({
        paymentTotal: DataTypes.DECIMAL,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'Payment',
    });
    return Payment;
};