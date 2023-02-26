module.exports = (sequelize, DataTypes) => {
    const OrderDetails = sequelize.define("OrderDetails", {
		orderId: {
			type: DataTypes.UUID,
			unique:"order_dish_comp",
			allowNull: false,
			primaryKey: true
		},
		dishId: {
			type: DataTypes.UUID,
			unique:"order_dish_comp",
			allowNull: false,
			primaryKey: true
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		quantity: {
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
	},);
	OrderDetails.removeAttribute('id');
	OrderDetails.associate = (models) => {
		OrderDetails.belongsTo(models.Order, {foreignKey: 'orderId'});
		OrderDetails.belongsTo(models.Dish, {foreignKey: 'dishId'});
    };
	
    return OrderDetails;
};