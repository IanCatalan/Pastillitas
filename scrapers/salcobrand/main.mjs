import { PlaywrightCrawler, Sitemap } from 'crawlee';
import { saveScrapedData } from '../data/saveData.js';
const crawler = new PlaywrightCrawler();


crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title = (await page.locator("h1.product_name_pdp").textContent()) || "Sin título";
  const titleClean = title.trim();
  const price = await page.locator("#product-price > .price > div > span").allTextContents();
  const priceActual = price[0].replace(/.*\$\s*/, "").trim();
  const url = request.url;
  // const principioActivoWithBlankSpaces = await page.locator('tr').nth(0).textContent();
  // const principioActivo= principioActivoWithBlankSpaces.trim();
  const tienda = 'Salcobrand';
  await saveScrapedData({ titleClean, price: priceActual, url, tienda });
  console.log(titleClean, priceActual, url, tienda);
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load('https://salcobrand.cl/sitemap2.xml'); // Hay que agregar hasta sitemap 11
await crawler.addRequests(urls);

// Run the crawler
await crawler.run();