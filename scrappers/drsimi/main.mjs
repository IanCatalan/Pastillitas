import { PlaywrightCrawler, Sitemap } from 'crawlee';
const crawler = new PlaywrightCrawler();


crawler.router.addDefaultHandler(async ({ request, log, page}) => {
  log.info(request.url);
  const title = await page.locator('span.vtex-store-components-3-x-productBrand--quickview').textContent();
  const price = await page.locator('.vtex-flex-layout-0-x-flexRowContent--preciosSimi').allTextContents();
  const url = request.url;
  const tienda = 'Dr Simi';
  console.log(price)
});

console.log('Loading sitemap');
const {urls}  = await Sitemap.load('https://www.drsimi.cl/sitemap/product-0.xml');
await crawler.addRequests(urls);

// Run the crawler
await crawler.run();