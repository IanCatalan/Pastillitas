import {
  createPlaywrightRouter,
  Dataset,
  RobotsFile,
  JSDOMCrawler,
} from "crawlee";

export const router = createPlaywrightRouter();
const robots = await RobotsFile.find("https://salcobrand.cl/");

// Handler para extraer detalles de productos
router.addHandler("DETALLE", async ({ request, page, log }) => {
  log.info(`Extracting data from: ${request.url}`);

  await page.waitForTimeout(6000);
  // Extraer título y SKU
  const title =
    (await page.locator("h1.product_name_pdp").textContent()) || "Sin título";
  const sku =
    (await page.locator("div.product-content > span.sku").textContent()) ||
    "Sin SKU";

  // Extraer precio

  const price = await page
    .locator("#product-price > .price > div > span")
    .allTextContents();

  // Combinar las partes para formar el precio completo

  // Extraer principio activo
  let principioActivo = "Sin principio activo";
  try {
    principioActivo = await page.locator("div > p.mb-0").textContent();
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
});

// Handler para manejar páginas de productos (paginación y enlaces a productos)
router.addHandler("PASTILLAS", async ({ page, enqueueLinks, log }) => {
  log.info(`Processing page: ${page.url()}`);
  //Cargar 96 resultados
  await page.waitForSelector(".ais-HitsPerPage-select");

  // Seleccionar la opción "96 Resultados"
  await page.selectOption(".ais-HitsPerPage-select", "96");
  console.log("Seleccionados 96 resultados por página");
  // Desplazarse hacia abajo para cargar todos los productos si es necesario
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(6000); // Esperar que cargue contenido diferido.

  // Esperar todos los enlaces de productos

  const url = await page.waitForSelector(".product-image > a", {
    timeout: 30000,
  });

  // Encolar enlaces a los detalles de productos
  if (robots.isAllowed(url)) {
    console.log("permitido");
    await enqueueLinks({
      selector: ".product-image > a",
      label: "DETALLE",
    });
  }else{
    console.log("PROHIBIDO")
  }
  // Verificar y encolar la siguiente página
  const nextButton = await page.$("li.active > a");
  if (nextButton && robots.isAllowed(nextButton)) {
    log.info(`Enqueueing next page`);
    await enqueueLinks({
      selector: "li.active > a",
      label: "PASTILLAS",
    });
  } else {
    log.info("No more pages to process.");
  }
});

// Handler predeterminado para manejar la primera página
router.addDefaultHandler(async ({ page, enqueueLinks, log }) => {
  log.info("Procesando pagina inicial de productos");
  await page.waitForSelector(".ais-HitsPerPage-select");

  // Seleccionar la opción "96 Resultados"
  await page.selectOption(".ais-HitsPerPage-select", "96");
  console.log("Seleccionados 96 resultados por página");

  // Desplazarse hacia abajo para cargar todos los productos si es necesario
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(6000); // Esperar que cargue contenido diferido.

  console.log("Encolar enlaces de productos en la página inicial");
  const url = await page.waitForSelector(".product-image > a");

  if (robots.isAllowed(url)) {
    console.log("permitido");
    await enqueueLinks({
      selector: ".product-image > a",
      label: "DETALLE", // Enlace a detalle del producto
    });
  } else {
    console.log("NO permitido");
  }

  console.log("Encolar la siguiente página si existe");
  const nextButton = await page.$("li.active > a"); // Selector del botón de siguiente página
  if (nextButton && robots.isAllowed(nextButton)) {
    console.log("permitido");
    await enqueueLinks({
      selector: "li.active > a",
      label: "PASTILLAS", // Enlace para manejar la siguiente página
    });
  }
});
