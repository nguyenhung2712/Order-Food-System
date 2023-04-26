'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            predictDate: {
                allowNull: false,
                type: Sequelize.DATE
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
            number: {
                allowNull: false,
                type: Sequelize.STRING
            },
            note: {
                type: Sequelize.STRING
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
            paymentId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Payments',
                    key: 'id',
                    as: 'paymentId',
                }
            },
            addressId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Addresses',
                    key: 'id',
                    as: 'addressId',
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Orders');
    }
};