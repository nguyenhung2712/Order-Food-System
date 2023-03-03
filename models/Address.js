module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		receiverName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phoneNum: {
			type: DataTypes.STRING,
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

    Address.associate = (models) => {
		Address.belongsToMany(models.User, { 
			through: 'User_Address' 
		});
		Address.belongsTo(models.Ward);
		
    };

    return Address;
};