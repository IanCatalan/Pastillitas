import db from "../../backend/models/index.js";
const { Product, Price, Store } = db;

async function saveScrapedData({ titleClean, price, url, tienda }) {
  function cleanPrice(price) {
    if (price === null || price === undefined || price === '') {
        return null;
    }

    const priceStr = String(price);

    const priceMatch = priceStr.match(/\$?\s*\d+(?:[.,]\d+)*\s*(?=\s|$|[^\d.,])/);
    
    if (!priceMatch) {
        return null;
    }

    let cleaned = priceMatch[0].replace(/[^\d.,]/g, '');

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    const lastSeparator = Math.max(lastComma, lastDot);

    if (lastSeparator === -1) {
        return parseFloat(cleaned) || null;
    }

    if (lastSeparator === lastDot && 
        cleaned.length - lastSeparator === 4 && 
        !cleaned.includes(',')) {
        return parseFloat(cleaned.replace(/\./g, ''));
    }

    const isLastSeparatorDecimal = cleaned.length - lastSeparator <= 3;

    if (isLastSeparatorDecimal) {
        cleaned = cleaned.slice(0, lastSeparator).replace(/[.,]/g, '') +
                 '.' + cleaned.slice(lastSeparator + 1);
    } else {
        cleaned = cleaned.replace(/[.,]/g, '');
    }

    const result = parseFloat(cleaned);
    return isNaN(result) ? null : result;
}

  try {
    const cleanedPrice = cleanPrice(price);

    if (cleanedPrice === null) {
      console.warn(`Precio inválido para ${titleClean} de ${tienda}.`);
      return; 
    }

    const [store] = await Store.findOrCreate({
      where: { name: tienda },
      defaults: { name: tienda },
    });

    const [product] = await Product.findOrCreate({
      where: { name: titleClean },
      defaults: { name: titleClean },
    });

    await Price.create({
      price: cleanedPrice,
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
