'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InteractRepCmt extends Model {
        static associate(models) {
            InteractRepCmt.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            InteractRepCmt.belongsTo(models.CommentRep, { foreignKey: 'repId', targetKey: 'id', as: 'rep' });
        }
    }
    InteractRepCmt.init({
        type: DataTypes.TINYINT,
        reason: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'InteractRepCmt',
    });
    return InteractRepCmt;
};