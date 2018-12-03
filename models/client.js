'use strict';
module.exports = (sequelize, DataTypes) => {
  const client = sequelize.define('client', {
    name: DataTypes.STRING,
    _id: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    secret: DataTypes.STRING
  }, {});
  client.associate = function(models) {
    // associations can be defined here
  };
  return client;
};