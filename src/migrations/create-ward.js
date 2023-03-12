'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Wards', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.STRING
			},
			wardName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			wardNameEn: {
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
			districtId: {
				allowNull: false,
				type: Sequelize.STRING,
				references: {
					model: 'Districts',
					key: 'id',
					as: 'districtId',
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
		await queryInterface.dropTable('Wards');
	}
};