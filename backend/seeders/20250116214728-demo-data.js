"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Stores", [
      { name: "Tienda 1", createdAt: new Date(), updatedAt: new Date() },
      { name: "Tienda 2", createdAt: new Date(), updatedAt: new Date() },
    ]);

    await queryInterface.bulkInsert("Products", [
      { name: "Paracetamol", createdAt: new Date(), updatedAt: new Date() },
      { name: "Ibuprofeno", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Stores", null, {});
    await queryInterface.bulkDelete("Products", null, {});
  },
};

