"use strict";
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
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
