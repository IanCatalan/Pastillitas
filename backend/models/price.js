"use strict";
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file llamará a este método automáticamente.
     */
    static associate(models) {
      // Una relación de muchos a uno con Product
      Price.belongsTo(models.Product, { foreignKey: "productId" });

      // Una relación de muchos a uno con Store
      Price.belongsTo(models.Store, { foreignKey: "storeId" });
    }
  }

  Price.init(
    {
      price: DataTypes.FLOAT, // Cambiado a FLOAT para manejar precios numéricos
      url: DataTypes.STRING,
      productId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Price",
    }
  );

  return Price;
};
