module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define("Token", {
		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	}, 
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	});

    Token.associate = (models) => {
        Token.belongsTo(models.User, {
			onDelete: "cascade",
		});
    }

    return Token;
};