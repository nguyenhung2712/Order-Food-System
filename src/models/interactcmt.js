'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InteractCmt extends Model {
        static associate(models) {
            InteractCmt.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
            InteractCmt.belongsTo(models.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });
        }
    }
    InteractCmt.init({
        type: DataTypes.TINYINT,
        reason: DataTypes.STRING,
        deletedAt: DataTypes.DATE,
        status: DataTypes.TINYINT
    }, {
        sequelize,
        modelName: 'InteractCmt',
    });
    return InteractCmt;
};