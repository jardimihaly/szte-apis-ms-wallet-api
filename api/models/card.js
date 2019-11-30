'use strict';
module.exports = (sequelize, DataTypes) => {
  const card = sequelize.define('card', {
    cardNumber: DataTypes.STRING,
    nameOfBank: DataTypes.STRING,
    nameOnCard: DataTypes.STRING,
    expiry: DataTypes.DATE,
    payPass: DataTypes.BOOLEAN,
    dailyLimit: DataTypes.DOUBLE,
    monthlyLimit: DataTypes.DOUBLE,
    cvv: DataTypes.STRING,
    default: DataTypes.BOOLEAN
  }, {});
  card.associate = function(models) {
    models.card.belongsTo(models.user);
    models.card.hasMany(models.payment);
  };
  return card;
};