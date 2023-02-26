module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
		id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastLogin: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		registeredAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isActived: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		isOTP: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		isEnabled: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	}, 
	{
		timestamps: false,
		createdAt: false,
		updatedAt: false,
	});
  
    User.associate = (models) => {
		User.hasMany(models.Rate , {
			onDelete: "cascade",
		});
		User.hasMany(models.Order , {
			onDelete: "cascade",
		});
		User.hasMany(models.Token , {
			onDelete: "cascade",
		});
		User.hasOne(models.RefreshToken, {
			onDelete: "cascade",
		});
		User.belongsTo(models.Info, {
			onDelete: "cascade",
		});
		User.belongsToMany(models.Role, { 
			through: 'User_Role' 
		});
    };

    return User;
};