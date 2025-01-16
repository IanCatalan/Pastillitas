"use strict";
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Scraper extends Model {}

  Scraper.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Scraper",
    }
  );

  return Scraper;
};
