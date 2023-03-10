'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require("uuid");
require("dotenv").config()
module.exports = (sequelize, DataTypes) => {
    class RefreshToken extends Model {
        static associate(models) {
            RefreshToken.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }
    RefreshToken.init({
        token: DataTypes.STRING,
        expiryDate: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'RefreshToken',
    });

    RefreshToken.createToken = async function (user) {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);

        let refreshToken = await this.create({
            token: uuidv4(),
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });

        return refreshToken.token;
    } 
    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };
    return RefreshToken;
};