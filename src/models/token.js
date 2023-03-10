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
        token: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Token',
    });
    Token.createToken = async function (user) {
        let token = await this.create({
            token: uuidv4(),
            userId: user.id
        });
        return token.token;
    } 
    return Token;
};