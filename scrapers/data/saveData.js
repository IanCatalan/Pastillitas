import db from "../../backend/models/index.js"; // Importa db como default
const { Product, Price, Store } = db;

async function saveScrapedData({ titleClean, price, url, tienda }) {
  function cleanPrice(price) {
    // Handle null, undefined, or empty string
    if (price === null || price === undefined || price === '') {
        return null;
    }

    // Convert to string if number
    const priceStr = String(price);

    // Find the first sequence of numbers with potential separators
    // This regex looks for numbers that might contain . or , but stops at other characters
    const priceMatch = priceStr.match(/\$?\s*\d+(?:[.,]\d+)*\s*(?=\s|$|[^\d.,])/);
    
    if (!priceMatch) {
        return null;
    }

    // Remove currency symbols, spaces and other non-numeric characters except . and ,
    let cleaned = priceMatch[0].replace(/[^\d.,]/g, '');

    // Determine decimal separator based on position
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    const lastSeparator = Math.max(lastComma, lastDot);

    // If no separators found, just parse the number
    if (lastSeparator === -1) {
        return parseFloat(cleaned) || null;
    }

    // Special case: if we have a number like "15.000" with no other separators,
    // and there are exactly 3 digits after the separator, treat it as a thousands separator
    if (lastSeparator === lastDot && 
        cleaned.length - lastSeparator === 4 && 
        !cleaned.includes(',')) {
        return parseFloat(cleaned.replace(/\./g, ''));
    }

    // If the last separator is within last 3 chars, it's likely a decimal separator
    const isLastSeparatorDecimal = cleaned.length - lastSeparator <= 3;

    if (isLastSeparatorDecimal) {
        // Remove all separators except the last one and standardize to period
        cleaned = cleaned.slice(0, lastSeparator).replace(/[.,]/g, '') +
                 '.' + cleaned.slice(lastSeparator + 1);
    } else {
        // Remove all separators if they're thousand separators
        cleaned = cleaned.replace(/[.,]/g, '');
    }

    const result = parseFloat(cleaned);
    return isNaN(result) ? null : result;
}

  try {
    // Limpia el precio antes de guardarlo
    const cleanedPrice = cleanPrice(price);

    if (cleanedPrice === null) {
      console.warn(`Precio inválido para ${titleClean} de ${tienda}.`);
      return; // No guarda si el precio es inválido
    }

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
