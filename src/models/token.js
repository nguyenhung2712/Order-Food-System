'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        static associate(models) {
            Token.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
        }
    }
    Token.init({
        token: DataTypes.STRING,
        expiredAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Token',
        tableName: 'tokens'
    });
    Token.createToken = async function (user, otpCode) {
        let token = await this.create({
            token: otpCode,
            expiredAt: new Date((new Date()).getTime() + 5 * 60000),
            userId: user.id
        });
        return token;
    }
    return Token;
};