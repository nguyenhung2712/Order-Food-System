module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		orderedDate: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		status: {
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

	Order.associate = (models) => {
		Order.hasMany(models.OrderDetails, { foreignKey: 'orderId'});
		Order.belongsTo(models.User);
		Order.belongsTo(models.Payment);
    };

    return Order;
};