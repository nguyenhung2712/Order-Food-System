'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderDetails', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            deletedAt: {
                allowNull: false,
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
            },
            dishId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Dishes',
					key: 'id',
					as: 'dishId',
				}
			},
            orderId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Orders',
					key: 'id',
					as: 'orderId',
				}
			},
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('OrderDetails');
    }
};