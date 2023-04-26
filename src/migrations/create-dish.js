'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Dishes', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            dishName: {
                allowNull: false,
                type: Sequelize.STRING
            },
            dishNameEn: {
                allowNull: false,
                type: Sequelize.STRING
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            image: {
                allowNull: false,
                type: Sequelize.STRING
            },
            ingredients: {
                allowNull: false,
                type: Sequelize.STRING
            },
            ingredientsEn: {
                allowNull: false,
                type: Sequelize.STRING
            },
            slug: {
                allowNull: false,
                type: Sequelize.STRING
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
            },
            typeId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'DishTypes',
                    key: 'id',
                    as: 'typeId',
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Dishes');
    }
};