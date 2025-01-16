"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      // Una tienda puede tener muchas entradas en Price
      Store.hasMany(models.Price, { foreignKey: "storeId" });
    }
  }

  Store.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );

  return Store;
};
