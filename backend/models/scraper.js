"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
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
