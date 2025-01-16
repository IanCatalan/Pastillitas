import { PlaywrightCrawler, Sitemap } from 'crawlee';
const crawler = new PlaywrightCrawler();


crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title =
  (await page.locator("h1.text-28").textContent()) || "Sin título";

  const price = await page.locator("ml-price-tag").textContent();
  const url = request.url;
  const tienda = 'Cruz Verde';
  console.log(title, price, url, tienda);
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load('https://www.cruzverde.cl/sitemap_0-product.xml'); //hay que agregar hasta el 3
await crawler.addRequests(urls);

// Run the crawler
await crawler.run();