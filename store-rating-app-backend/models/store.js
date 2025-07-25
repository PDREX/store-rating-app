'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Store.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    }
  }
  Store.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Store',
  });
   Store.associate = function(models) {
  Store.belongsTo(models.User, { foreignKey: 'ownerId' });
  Store.hasMany(models.Rating, { foreignKey: 'storeId' });
};

  return Store;
};

