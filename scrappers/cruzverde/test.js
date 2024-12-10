// Importar Crawlee y sus herramientas
import { RobotsFile, PlaywrightCrawler } from 'crawlee';

(async () => {
  // Crear una instancia del archivo robots.txt
  const robots = await RobotsFile.find('https://www.api.cruzverde.cl');

  // Crear una instancia del crawler
  const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page }) {
      console.log(`Crawling URL: ${request.url}`);
      // Procesar la página (ejemplo: capturar el título)
      const title = await page.title();
      console.log(`Title: ${title}`);
    },
  });

  // Verificar si la URL es permitida según robots.txt
  const url = 'https://cruzverde.cl/product-service/products/search?limit=12&offset=0&sort=&q=&refine[]=cgid=anticonceptivos-orales-anticonceptivos&isAndes=true&inventoryId=343&inventoryZone=343';
  if (robots.isAllowed(url)) {
    console.log(`URL allowed by robots.txt: ${url}`);
    await crawler.addRequests([url]);
  } else {
    console.log(`URL disallowed by robots.txt: ${url}`);
  }

  // Agregar las URLs extraídas del sitemap
  const sitemapUrls = await robots.parseUrlsFromSitemaps();
  if (sitemapUrls.length > 0) {
    console.log(`Found ${sitemapUrls.length} URLs in the sitemap.`);
    await crawler.addRequests(sitemapUrls);
  } else {
    console.log('No URLs found in the sitemap.');
  }

  // Iniciar el crawler
  await crawler.run();
})();
