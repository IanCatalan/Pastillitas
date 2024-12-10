import { createPlaywrightRouter, Dataset, RobotsFile } from "crawlee";

export const router = createPlaywrightRouter();
const robots = await RobotsFile.find("https://www.cruzverde.cl");

// Handler para extraer detalles de productos
router.addHandler("DETALLE", async ({ request, page, log }) => {
  log.info(`Extracting data from: ${request.url}`);

  // Extraer título y SKU
  const title =
    (await page.locator("h1.text-28").textContent()) || "Sin título";

  // Extraer precio

  const price = await page.locator("ml-price-tag").textContent();

  // Combinar las partes para formar el precio completo

  // Extraer principio activo
  let principioActivo = "Sin principio activo";
  try {
    principioActivo = await page
      .locator(".ng-trigger.ng-trigger-fadeIn.ng-star-inserted", {
        hasText: "Principales principios activos",
      })
      .allTextContents();
  } catch (error) {
    log.warning(`No se pudo extraer el principio activo: ${error.message}`);
  }

  // Estructurar los resultados
  const results = {
    url: request.url,
    title: title.trim(),
    price: price,
    principioActivo: principioActivo,
  };

  log.info(`Saving data for: ${request.url}`);
  await Dataset.pushData(results);
});

router.addHandler("PASTILLAS", async ({ page, enqueueLinks }) => {
  
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  const url = await page.waitForSelector("at-image.max-w-sm.h-full > a");
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
  
});


// Handler predeterminado para manejar la primera página y productos
router.addDefaultHandler(async ({ page, enqueueLinks, log }) => {
  log.info("Procesando pagina inicial de productos");

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  console.log("Encolar enlaces de productos en la página inicial");
  const url = await page.waitForSelector("at-image.max-w-sm.h-full > a");

  if (robots.isAllowed(url)) {
    console.log("permitido");
    await enqueueLinks({
      selector: "at-image.max-w-sm.h-full > a",
      label: "DETALLE", // Enlace a detalle del producto
    });
  } else {
    console.log("NO permitido");
  }

// Esperar a que los modales aparezcan
await page.waitForSelector("button:has-text('No, gracias')", { state: "visible", timeout: 5000 });
await page.waitForSelector("span:has-text('Aceptar')", { state: "visible", timeout: 5000 });

// Cerrar el modal "No, gracias"
try {
  const noGraciasButton = await page.locator("button", { hasText: "No, gracias" });
  await noGraciasButton.click();
  console.log("Modal 'No, gracias' cerrado.");
} catch (error) {
  console.log("El botón 'No, gracias' no apareció.");
}

// Cerrar el modal "Aceptar"
try {
  const aceptarButton = await page.locator("span", { hasText: "Aceptar" });
  await aceptarButton.click();
  console.log("Modal 'Aceptar' cerrado.");
  await page.locator(".rounded-full.bg-quaternary.ml-15").nth(0).click({ delay: 6000 });
} catch (error) {
  console.log("El botón 'Aceptar' no apareció.");
} 

});
