'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DishToppings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
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
            tppId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Toppings',
                    key: 'id',
                    as: 'tppId',
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('DishToppings');
    }
};