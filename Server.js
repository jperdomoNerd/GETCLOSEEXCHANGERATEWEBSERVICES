import puppeteer from 'puppeteer';
import express from 'express';
import dotenv from "dotenv";

dotenv.config();
const app = express();

async function getTend() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(60000);

  await page.goto(
    'https://suameca.banrep.gov.co/estadisticas-economicas-back/reporte-oac.html?path=%2FEstadisticas_Banco_de_la_Republica%2F4_Sector_Externo_tasas_de_cambio_y_derivados%2F1_Tasas_de_cambio%2F1_Tasa_de_cambio_del_peso_colombiano_por_USD(TRM)%2F2_Mercado_Interbancario_de_Divisas%2F1_Mercado_interbancario_de_divisas',
    {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    }
  );

  console.log("Funciona")

  const values = await page.$$eval(
    '.bi_viz_gridview_cell_text_nowrap',
    els => els.map(e => e.innerText.trim())
  );

  const todayExchangeRate = parseFloat(values[5].replace(',', ''));
  const closingExchangeRate = parseFloat(values[13].replace(',', ''));

  return {
    todayExchangeRate,
    closingExchangeRate
  };
  // } finally {
  //   await browser.close();
  // }
}

// routing
app.get('/', async (req, res) => {
  try {
    const data = await getTend();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server started on port 3000');
});
