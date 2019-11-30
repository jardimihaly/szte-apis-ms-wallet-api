'use strict';
module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define('payment', {
    description: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    accepted: DataTypes.BOOLEAN,
    referenceNumber: DataTypes.STRING
  }, {});
  payment.associate = function(models) {
    models.payment.belongsTo(models.card);
  };
  return payment;
};