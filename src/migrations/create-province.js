'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Provinces', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			provinceName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			provinceNameEn: {
				type: Sequelize.STRING,
				allowNull: false
			},
			fullname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			fullnameEn: {
				type: Sequelize.STRING,
				allowNull: false
			},
			codeName: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('Provinces');
	}
};