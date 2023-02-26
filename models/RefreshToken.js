const authConfig = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("RefreshToken", {
        token: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        expiryDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });
  
    RefreshToken.createToken = async function (user) {
        let expiredAt = new Date();
    
        expiredAt.setSeconds(expiredAt.getSeconds() + authConfig.jwtRefreshExpiration);
    
        let _token = uuidv4();
    
        let refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });
    
        return refreshToken.token;
    };
  
    RefreshToken.verifyExpiration = (token) => {
      return token.expiryDate.getTime() < new Date().getTime();
    };
    RefreshToken.associate = (models) => {
		RefreshToken.belongsTo(models.User);
    };
      
    return RefreshToken;
};