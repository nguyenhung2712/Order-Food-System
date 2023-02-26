module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
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
	}, 
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	});

	Role.associate = (models) => {
		Role.belongsToMany(models.User, { 
			through: 'User_Role' 
		})
    };

    return Role;
};