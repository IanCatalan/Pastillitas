import db from "../../backend/models/index.js";  // Importa db como default
const { Product, Price, Store } = db;


async function saveScrapedData({ titleClean, price, url, tienda }) {
    try {
      // Buscar o crear la tienda
      const [store] = await Store.findOrCreate({
        where: { name: tienda },
        defaults: { name: tienda },
      });
  
      // Buscar o crear el producto
      const [product] = await Product.findOrCreate({
        where: { name: titleClean },
        defaults: { name: titleClean },
      });
  
      // Insertar el precio asociado a la tienda y al producto
      await Price.create({
        price: parseFloat(price.replace(",", ".")), // Convertir a número
        url,
        productId: product.id,
        storeId: store.id,
      });
  
      console.log(`Producto ${titleClean} de ${tienda} guardado en la base de datos.`);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
}
export default saveScrapedData;