module.exports = (sequelize, DataTypes) => {
    const Dish = sequelize.define("Dish", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ingredients: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        status: {
			type: DataTypes.INTEGER,
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

	Dish.associate = (models) => {
		Dish.hasMany(models.OrderDetails, { foreignKey: 'dishId'});
		Dish.hasMany(models.Rate , {
			onDelete: "cascade",
		});
		Dish.belongsTo(models.DishType);
    };

    return Dish;
};