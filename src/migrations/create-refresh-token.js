'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RefreshTokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            token: {
                type: Sequelize.STRING
            },
            expiryDate: {
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            userId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId',
				}
			},
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('RefreshTokens');
    }
};