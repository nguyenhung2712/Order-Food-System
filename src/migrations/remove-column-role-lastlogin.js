'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn('Roles', 'lastLogin')
        ]);
    },

    async down (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn('Roles', 'lastLogin', {
                type: Sequelize.TINYINT,
                allowNull: false,
            })
        ]);
    }
};
