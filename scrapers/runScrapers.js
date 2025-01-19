import { scraperCruzVerde } from "./cruzverde/main.mjs";
import { scraperDrSimi } from "./drsimi/main.mjs";
import { scraperFarmaciaAhumada } from "./farmaciaahumada/main.mjs";
import { scraperSalcobrand } from "./salcobrand/main.mjs";

async function runScrapers() {
  try {
    
    await scraperDrSimi();
    console.log("Scraper 1 completado.");

    // Ejecuta el segundo scraper después de que el primero termine
    await scraperFarmaciaAhumada();
    console.log("Scraper 2 completado.");

    // Ejecuta el tercer scraper después de que el segundo termine
    await scraperSalcobrand();
    console.log("Scraper 3 completado.");

    // Ejecuta el cuarto scraper después de que el tercero termine
    await scraperCruzVerde();
    console.log("Scraper 4 completado.");

  } catch (error) {
    console.error("Error al ejecutar los scrapers:", error);
  }
}

// Ejecuta todos los scrapers en secuencia
runScrapers();
