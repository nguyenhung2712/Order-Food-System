'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Wards', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			provinceName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			provinceNameEn: {
				allowNull: false,
				type: Sequelize.STRING
			},
			fullname: {
				allowNull: false,
				type: Sequelize.STRING
			},
			fullnameEn: {
				allowNull: false,
				type: Sequelize.STRING
			},
			codeName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			districtId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Districts',
					key: 'id',
					as: 'districtId',
				}
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Wards');
	}
};