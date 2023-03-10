'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
            },
            paymentTotal: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            deletedAt: {
                type: Sequelize.DATE
            },
            status: {
                allowNull: false,
                type: Sequelize.TINYINT
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
        await queryInterface.dropTable('Payments');
    }
};