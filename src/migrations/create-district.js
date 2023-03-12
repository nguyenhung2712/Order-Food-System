'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Districts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.STRING
			},
			districtName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			districtNameEn: {
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
			provinceId: {
				allowNull: false,
				type: Sequelize.STRING,
				references: {
					model: 'Provinces',
					key: 'id',
					as: 'provinceId',
				}
			},
            unitId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Unit',
					key: 'id',
					as: 'unitId',
				}
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Districts');
	}
};