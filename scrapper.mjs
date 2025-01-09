import { PlaywrightCrawler, Sitemap, Dataset } from 'crawlee';

const crawler = new PlaywrightCrawler({
    // Function called for each URL
    async requestHandler({ request, log, page }) {
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
    },
});

const { urls } = await Sitemap.load('https://www.drsimi.cl/sitemap/product-0.xml');

await crawler.addRequests(urls);

// Run the crawler
await crawler.run();