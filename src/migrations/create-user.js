'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			firstName: {
				type: Sequelize.STRING
			},
			lastName: {
				type: Sequelize.STRING
			},
			avatar: {
				type: Sequelize.STRING
			},
			gender: {
				type: Sequelize.TINYINT
			},
			phoneNum: {
				type: Sequelize.STRING
			},
			isActived: {
				type: Sequelize.TINYINT,
				allowNull: false
			},
			lastLogin: {
				type: Sequelize.DATE,
				allowNull: false
			},
			deletedAt: {
				type: Sequelize.DATE
			},
			status: {
				type: Sequelize.TINYINT,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	}
};