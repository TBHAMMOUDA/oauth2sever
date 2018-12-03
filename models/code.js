'use strict';
module.exports = (sequelize, DataTypes) => {
  const code = sequelize.define('code', {
    value: DataTypes.STRING,
    redirectUri: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER
  }, {});
  code.associate = function(models) {
    // associations can be defined here
  };
  return code;
};