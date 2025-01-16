"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Un producto puede tener muchas entradas en Price
      Product.hasMany(models.Price, { foreignKey: "productId" });
    }
  }

  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
