'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is called automatically by models/index.js
     */
    static associate(models) {
      User.hasMany(models.Rating, { foreignKey: 'userId' });
      User.hasMany(models.Store, { foreignKey: 'ownerId' });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user', // other possible values: 'admin', 'store_owner'
        validate: {
          isIn: [['user', 'admin', 'store_owner']],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};