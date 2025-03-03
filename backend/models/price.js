"use strict";
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Price extends Model {

    static associate(models) {
      Price.belongsTo(models.Product, { foreignKey: "productId" });

      Price.belongsTo(models.Store, { foreignKey: "storeId" });
    }
  }

  Price.init(
    {
      price: DataTypes.FLOAT, 
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
