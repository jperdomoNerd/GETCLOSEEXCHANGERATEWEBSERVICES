import express from 'express';
import dotenv from "dotenv";
import ScraperService from './ScraperService.js';
import CacheService from './CacheService.js';

dotenv.config();

// --- Configuración de Express ---
const app = express();
const scraper = new ScraperService();

// Ruta para conocer la disponibilidad del servidor
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta de caché: Valida si han pasado 6 horas antes de decidir si scrapear o no
app.get('/exchange-rate', async (req, res) => {
  try {
    let cache = await CacheService.get();
    let needsUpdate = false;

    if (cache && cache.updatedAt) {
      const lastUpdate = new Date(cache.updatedAt);
      const now = new Date();
      
      // Cálculo de la diferencia de tiempo en milisegundos a horas
      const diffInMs = now - lastUpdate;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      console.log(`Horas transcurridas desde la última actualización: ${diffInHours.toFixed(2)}`);

      // Condición de 6 horas
      if (diffInHours >= 6) {
        needsUpdate = true;
      }
    } else {
      // Si el archivo no existe o está corrupto, forzar actualización
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log("El caché expiró o no existe. Actualizando datos mediante scraping...");
      const freshData = await scraper.getTend();
      res.json({ ...freshData, info: "Datos actualizados mediante scraping" });
    } else {
      res.json({ ...cache, info: "Datos recuperados del caché local" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar la solicitud de datos' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});