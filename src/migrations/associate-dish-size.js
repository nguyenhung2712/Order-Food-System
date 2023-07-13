'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DishHasSizes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            price: {
                type: Sequelize.DECIMAL
            },
            quantityInDay: {
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
            sizeId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'DishSizes',
                    key: 'id',
                    as: 'sizeId',
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('DishHasSizes');
    }
};