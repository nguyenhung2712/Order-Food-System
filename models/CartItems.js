module.exports = (sequelize, DataTypes) => {
    const CartItems = sequelize.define("CartItems", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		updatedAt: {
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

	CartItems.associate = (models) => {
		CartItems.hasOne(models.Dish, {
			onDelete: "cascade",
		});
		CartItems.belongsTo(models.ShoppingSession);
    };

    return CartItems;
};