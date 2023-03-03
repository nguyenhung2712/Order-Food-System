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
		is2FA: {
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
		User.belongsToMany(models.Address, { 
			through: 'User_Address' 
		});
		User.belongsToMany(models.Role, { 
			through: 'User_Role' 
		});
		
		User.hasMany(models.Rate , {
			onDelete: "cascade",
		});
		User.hasMany(models.Order , {
			onDelete: "cascade",
		});
		User.hasMany(models.Token , {
			onDelete: "cascade",
		});
		User.hasMany(models.Blog , {
			onDelete: "cascade",
		});
		User.hasMany(models.Comment , {
			onDelete: "cascade",
		});
		User.hasMany(models.CommentReply , {
			onDelete: "cascade",
		});
		User.hasMany(models.BlogPref, { foreignKey: 'userId' });
		User.hasMany(models.ConverJoining , { foreignKey: 'userId' });

		User.hasOne(models.RefreshToken, {
			onDelete: "cascade",
		});
		User.hasOne(models.ShoppingSession, {
			onDelete: "cascade",
		});

		User.belongsTo(models.Info, {
			onDelete: "cascade",
		});
		
		
    };

    return User;
};