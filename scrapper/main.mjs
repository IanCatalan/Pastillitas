import { PlaywrightCrawler, log } from 'crawlee';
import { router } from './routes.mjs';
import crawleroptions from './crawleroptions.js';

// This is better set with CRAWLEE_LOG_LEVEL env var
// or a configuration option. This is just for show 😈
log.setLevel(log.LEVELS.DEBUG);

log.debug('Iniciando el crawleer.');

const crawler = new PlaywrightCrawler({
    
    ...crawleroptions,
    requestHandler: router,
    maxConcurrency: 3
});

await crawler.run(['https://www.drsimi.cl/medicamento/salud-femenina?page=1']);