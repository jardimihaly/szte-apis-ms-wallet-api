'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    addressInfo: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    models.user.hasMany(models.card);
  };
  return user;
};