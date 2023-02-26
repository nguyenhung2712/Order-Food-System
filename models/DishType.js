module.exports = (sequelize, DataTypes) => {
    const DishType = sequelize.define("DishType", {
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
		description: {
			type: DataTypes.STRING,
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

	DishType.associate = (models) => {
		DishType.hasMany(models.Dish);
    };

    return DishType;
};