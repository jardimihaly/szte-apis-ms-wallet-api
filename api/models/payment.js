'use strict';
module.exports = (sequelize, DataTypes) => {
  const payment = sequelize.define('payment', {
    amount: DataTypes.DOUBLE,
    accepted: DataTypes.BOOLEAN,
    referenceNumber: DataTypes.STRING,
    vendorId: DataTypes.INTEGER,
    remarks: DataTypes.STRING
  }, {});
  payment.associate = function(models) {
    models.payment.belongsTo(models.card);
  };
  return payment;
};