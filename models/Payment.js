module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
		},
		paidBy: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		paymentDate: {
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

	Payment.associate = (models) => {
		Payment.hasMany(models.Order, {
			onDelete: "cascade",
		});
    };

    return Payment;
};