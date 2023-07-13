'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CartItemToppings', {
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            unit: {
                type: Sequelize.STRING
            },
            cartItemId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'CartItems',
                    key: 'id',
                    as: 'cartItemId',
                },
                primaryKey: true,
            },
            tppId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Toppings',
                    key: 'id',
                    as: 'tppId',
                },
                primaryKey: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CartItemToppings');
    }
};