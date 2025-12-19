
import fs from 'fs/promises';
//  Clase encargada de la persistencia (Caché)
class CacheService {
  static FILE_PATH = './cache.json';

  static async save(data) {
    await fs.writeFile(this.FILE_PATH, JSON.stringify(data, null, 2));
  }

  static async get() {
    try {
      const data = await fs.readFile(this.FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }
}

export default CacheService;