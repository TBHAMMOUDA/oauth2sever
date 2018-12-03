'use strict';
module.exports = (sequelize, DataTypes) => {
  const token = sequelize.define('token', {
    value: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER
  }, {});
  token.associate = function(models) {
    // associations can be defined here
  };
  return token;
};