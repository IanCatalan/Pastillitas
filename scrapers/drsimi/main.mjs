import { PlaywrightCrawler, Sitemap } from 'crawlee';
import saveScrapedData from '../data/saveData.js';
const crawler = new PlaywrightCrawler();


crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title = await page.locator('span.vtex-store-components-3-x-productBrand--quickview').textContent();
  const titleClean = title.trim();
  const priceInArray = await page.locator('span.vtex-product-price-1-x-sellingPrice').nth(0).allTextContents();
  const price = priceInArray[0].replace(/.*\$\s*/, "").trim();
  const url = request.url;
  const tienda = 'Dr Simi';
  await saveScrapedData({ titleClean, price, url, tienda });
  console.log(titleClean, price, url, tienda)
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load('https://www.drsimi.cl/sitemap/product-0.xml');
await crawler.addRequests(urls);

// Run the crawler
await crawler.run();