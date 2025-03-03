import { PlaywrightCrawler, Sitemap } from 'crawlee';
import saveScrapedData from '../data/saveData.js';
const crawler = new PlaywrightCrawler();


export async function scraperFarmaciaAhumada(){crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title = (await page.locator("h1.product-name").textContent()) || "Sin título";
  const titleClean = title.trim();
  const priceWithBlankSpaces = await page.locator(".prices >.price > span.default-price> span.sales> span.value").textContent();
  const price = priceWithBlankSpaces.trim();

  const url = request.url;
  const tienda = 'Farmacia Ahumada';
  await saveScrapedData({ titleClean, price, url, tienda });
  console.log(titleClean, price, url, tienda);
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load('https://www.farmaciasahumada.cl/sitemap_0-product.xml');
await crawler.addRequests(urls);

await crawler.run();
}