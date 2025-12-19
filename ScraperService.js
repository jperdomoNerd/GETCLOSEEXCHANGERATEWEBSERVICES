import puppeteer from 'puppeteer-core';
import CacheService from './CacheService.js';

// Clase encargada del Scraping
class ScraperService {
  async getTend() {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-zygote'
      ],
    });

    try {
      const page = await browser.newPage();

      await page.goto(
        'https://suameca.banrep.gov.co/estadisticas-economicas-back/reporte-oac.html?path=%2FEstadisticas_Banco_de_la_Republica%2F4_Sector_Externo_tasas_de_cambio_y_derivados%2F1_Tasas_de_cambio%2F1_Tasa_de_cambio_del_peso_colombiano_por_USD(TRM)%2F2_Mercado_Interbancario_de_Divisas%2F1_Mercado_interbancario_de_divisas',
        {
          waitUntil: 'networkidle0',
          timeout: 120000
        }
      );

      const values = await page.$$eval(
        '.bi_viz_gridview_cell_text_nowrap',
        els => els.map(e => e.innerText.trim())
      );

      console.log(values);

      const todayExchangeRate = parseFloat(values[5].replace(',', ''));
      const closingExchangeRate = parseFloat(values[13].replace(',', ''));

      const data = {
        todayExchangeRate,
        closingExchangeRate,
        updatedAt: new Date().toISOString()
      };

      // Guardar en el archivo de caché
      await CacheService.save(data);

      return data;
    } finally {
      await browser.close();
    }
  }
}

export default ScraperService;