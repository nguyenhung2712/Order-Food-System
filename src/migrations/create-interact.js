'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Interacts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            type: {
                allowNull: false,
                type: Sequelize.TINYINT
            },
            otherReason: {
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
                },
            },
            reasonId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Reasons',
                    key: 'id',
                    as: 'reasonId',
                },
            },
            blogId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Blogs',
                    key: 'id',
                    as: 'blogId',
                },
            },
            commentId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Comments',
                    key: 'id',
                    as: 'commentId',
                },
            },
            repId: {
                type: Sequelize.UUID,
                references: {
                    model: 'CommentReps',
                    key: 'id',
                    as: 'repId',
                },
            },
            ratingId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Rates',
                    key: 'id',
                    as: 'ratingId',
                },
            },
            reportedUId: {
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'reportedUId',
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Interacts');
    }
};