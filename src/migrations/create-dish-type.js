'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DishTypes', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            typeName: {
                allowNull: false,
                type: Sequelize.STRING
            },
            typeNameEn: {
                allowNull: false,
                type: Sequelize.STRING
            },
            icon: {
                allowNull: false,
                type: Sequelize.STRING
            },
            slug: {
                allowNull: false,
                type: Sequelize.STRING
            },
            slugEn: {
                allowNull: false,
                type: Sequelize.STRING
            },
            unit: {
                allowNull: false,
                type: Sequelize.STRING
            },
            unitEn: {
                allowNull: false,
                type: Sequelize.STRING
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
        await queryInterface.dropTable('DishTypes');
    }
};