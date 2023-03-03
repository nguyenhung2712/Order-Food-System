module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define("Blog", {
        id: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		header: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		publishedDate: {
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

	Blog.associate = (models) => {
		Blog.hasMany(models.BlogPref, { foreignKey: 'blogId' });
		Blog.hasMany(models.Comment , {
			onDelete: "cascade",
		});
        Blog.belongsTo(models.User, {
			onDelete: "cascade",
		});
    };

    return Blog;
};