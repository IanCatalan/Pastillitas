import { PlaywrightCrawler, Sitemap } from 'crawlee';
import saveScrapedData from '../data/saveData.js';
const crawler = new PlaywrightCrawler();


export async function scraperSalcobrand() {crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title = (await page.locator("h1.product_name_pdp").textContent()) || "Sin título";
  const titleClean = title.trim();
  const price = await page.locator("#product-price > .price > div > span").allTextContents();
  const priceActual = price[0].replace(/.*\$\s*/, "").trim();
  const url = request.url;
  const tienda = 'Salcobrand';
  await saveScrapedData({ titleClean, price: priceActual, url, tienda });
  console.log(titleClean, priceActual, url, tienda);
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load(['https://salcobrand.cl/sitemap2.xml', 'https://salcobrand.cl/sitemap3.xml','https://salcobrand.cl/sitemap4.xml','https://salcobrand.cl/sitemap5.xml','https://salcobrand.cl/sitemap6.xml','https://salcobrand.cl/sitemap7.xml','https://salcobrand.cl/sitemap8.xml','https://salcobrand.cl/sitemap9.xml','https://salcobrand.cl/sitemap10.xml','https://salcobrand.cl/sitemap11.xml'] ); // Hay que agregar hasta sitemap 11
await crawler.addRequests(urls);

await crawler.run();
}