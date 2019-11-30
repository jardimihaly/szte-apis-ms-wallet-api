'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cardNumber: {
        type: Sequelize.STRING
      },
      nameOfBank: {
        type: Sequelize.STRING
      },
      nameOnCard: {
        type: Sequelize.STRING
      },
      expiry: {
        type: Sequelize.DATE
      },
      payPass: {
        type: Sequelize.BOOLEAN
      },
      dailyLimit: {
        type: Sequelize.NUMBER
      },
      ccv: {
        type: Sequelize.STRING
      },
      default: {
        type: Sequelize.BOOLEAN
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cards');
  }
};