module.exports = (sequelize, DataTypes) => {
    const BlogPref = sequelize.define("BlogPref", {
		blogId: {
			type: DataTypes.UUID,
			unique:"user_blog_comp",
			allowNull: false,
			primaryKey: true
		},
		userId: {
			type: DataTypes.UUID,
			unique:"user_blog_comp",
			allowNull: false,
			primaryKey: true
		},
		likedDate: {
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
	},);
	BlogPref.removeAttribute('id');
	BlogPref.associate = (models) => {
		BlogPref.belongsTo(models.Blog, {foreignKey: 'blogId'});
		BlogPref.belongsTo(models.User, {foreignKey: 'userId'});
    };
	
    return BlogPref;
};