import { PlaywrightCrawler, Sitemap } from 'crawlee';
import saveScrapedData from '../data/saveData.js';
const crawler = new PlaywrightCrawler();


crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title =(await page.locator("h1.text-28").textContent()) || "Sin título";
  const titleClean = title.trim();
  const price = await page.locator(".line-through", { hasText: 'Normal' }).textContent();
  const priceActual = price.replace(/[^0-9,.]/g).trim();
  const url = request.url;
  const tienda = 'Cruz Verde';
  await saveScrapedData({ titleClean, price: priceActual, url, tienda });
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load(['https://www.cruzverde.cl/sitemap_0-product.xml','https://www.cruzverde.cl/sitemap_1-product.xml','https://www.cruzverde.cl/sitemap_3-product.xml']); 
await crawler.addRequests(urls);


await crawler.run();
