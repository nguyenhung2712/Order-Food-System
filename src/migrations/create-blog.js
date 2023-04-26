'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Blogs', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            header: {
                allowNull: false,
                type: Sequelize.STRING
            },
            content: {
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
        await queryInterface.dropTable('Blogs');
    }
};