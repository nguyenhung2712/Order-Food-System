'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Reason extends Model {
        static associate(models) {
            Reason.hasMany(models.Interact, { foreignKey: 'reasonId' });
        }
    }
    Reason.init({
        reasonName: DataTypes.STRING,
        reasonDes: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Reason',
    });
    return Reason;
};