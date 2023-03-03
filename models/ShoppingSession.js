module.exports = (sequelize, DataTypes) => {
    const ShoppingSession = sequelize.define("ShoppingSession", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		total: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isEnabled: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
    },
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	});

	ShoppingSession.associate = (models) => {
		ShoppingSession.hasOne(models.User, {
			onDelete: "cascade",
		});
		ShoppingSession.hasMany(models.CartItems);
    };

    return ShoppingSession;
};