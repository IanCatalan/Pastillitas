const { Product, Store, Price } = require("./models");

async function testDB() {
  const products = await Product.findAll({
    include: [{ model: Price, include: [Store] }],
  });

  console.log(JSON.stringify(products, null, 2));
}

testDB();
