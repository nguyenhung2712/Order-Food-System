'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CartItems', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            deletedAt: {
                type: Sequelize.DATE
            },
            status: {
                allowNull: false,
                type: Sequelize.TINYINT
            },
            expiryDate: {
                allowNull: false,
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
            cartId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'Carts',
					key: 'id',
					as: 'cartId',
				}
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CartItems');
    }
};