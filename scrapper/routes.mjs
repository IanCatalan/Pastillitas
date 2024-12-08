import { createPlaywrightRouter, Dataset } from 'crawlee';

export const router = createPlaywrightRouter();

// Handler para extraer detalles de productos
router.addHandler('DETALLE', async ({ request, page, log }) => {
    log.info(`Extracting data from: ${request.url}`);

    // Extraer título y SKU
    const title = await page.locator('span.vtex-store-components-3-x-productBrand').textContent() || 'Sin título';
    const sku = await page.locator('span.vtex-product-identifier-0-x-product-identifier__value').textContent() || 'Sin SKU';

    // Extraer partes del precio

    const price = await page.evaluate(() => {
        const priceElement = document.querySelector('.vtex-product-price-1-x-sellingPriceValue');
        if (!priceElement) return null; // Si no hay precio, devolver null
    
        const integers = Array.from(priceElement.querySelectorAll('.vtex-product-price-1-x-currencyInteger'))
            .map(el => el.textContent.trim());
        const group = priceElement.querySelector('.vtex-product-price-1-x-currencyGroup')?.textContent.trim() || '';
        
        return integers.join(group); // Combina las partes del precio
    });
    

    // Combinar las partes para formar el precio completo
  

    // Extraer principio activo
    let principioActivo = 'Sin principio activo';
    try {
        principioActivo = await page.locator('tr.vtex-store-components-3-x-specificationsTableRow--principioActivo td.vtex-store-components-3-x-specificationItemSpecifications--principioActivo div').textContent();
    } catch (error) {
        log.warning(`No se pudo extraer el principio activo: ${error.message}`);
    }

    // Estructurar los resultados
    const results = {
        url: request.url,
        title: title.trim(),
        sku: sku.trim(),
        price: price,
        principioActivo: principioActivo.trim(),
    };

    log.info(`Saving data for: ${request.url}`);
    await Dataset.pushData(results);
});


// Handler para manejar páginas de productos (paginación y enlaces a productos)
router.addHandler('PASTILLAS', async ({ page, enqueueLinks, log }) => {
    log.info(`Processing page: ${page.url()}`);

    // Desplazarse hacia abajo para cargar todos los productos si es necesario
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(6000); // Esperar que cargue contenido diferido.

    // Esperar todos los enlaces de productos
    
    await page.waitForSelector('a.vtex-product-summary-2-x-clearLink', { timeout: 30000 });

    // Encolar enlaces a los detalles de productos
    await enqueueLinks({
        selector: 'a.vtex-product-summary-2-x-clearLink',
        label: 'DETALLE',
    });

    // Verificar y encolar la siguiente página
    const nextButton = await page.$('a.inline-flex');
    if (nextButton) {
        log.info(`Enqueueing next page.`);
        await enqueueLinks({
            selector: 'a.inline-flex',
            label: 'PASTILLAS',
        });
    } else {
        log.info('No more pages to process.');
    }
});


// Handler predeterminado para manejar la primera página
router.addDefaultHandler(async ({ page, enqueueLinks, log }) => {
    log.info('Procesando pagina inicial de productos');

    // Desplazarse hacia abajo para cargar todos los productos si es necesario
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(6000); // Esperar que cargue contenido diferido.
    
    console.log('Encolar enlaces de productos en la página inicial')
    await page.waitForSelector('a.vtex-product-summary-2-x-clearLink');
    await enqueueLinks({
        selector: 'a.vtex-product-summary-2-x-clearLink',
        label: 'DETALLE', // Enlace a detalle del producto
    });

    console.log('Encolar la siguiente página si existe') 
    const nextButton = await page.$('a.inline-flex'); // Selector del botón de siguiente página
    if (nextButton) {
        await enqueueLinks({
            selector: 'a.inline-flex',
            label: 'PASTILLAS', // Enlace para manejar la siguiente página
        });
    }
});
