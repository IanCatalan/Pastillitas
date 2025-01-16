import { PlaywrightCrawler, Sitemap } from 'crawlee';
const crawler = new PlaywrightCrawler();


crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title = (await page.locator("h1.product_name_pdp").textContent()) || "Sin título";
  const price = await page
    .locator("#product-price > .price > div > span")
    .allTextContents();
  const url = request.url;
  const tienda = 'Salcobrand';
  console.log(title, price, url, tienda);
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load('https://salcobrand.cl/sitemap2.xml'); // Hay que agregar hasta sitemap 11
await crawler.addRequests(urls);

// Run the crawler
await crawler.run();