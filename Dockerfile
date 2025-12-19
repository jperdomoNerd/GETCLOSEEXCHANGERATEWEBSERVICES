FROM node:20-slim

# Instalar Chromium y dependencias
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Forzar a Puppeteer a NO descargar Chrome (ahorra espacio y evita errores de ruta)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /usr/src/app

COPY package*.json ./

# Instalamos dependencias. 
# Si usas puppeteer-core es más ligero, si usas puppeteer normal esto evitará la descarga.
RUN npm install

COPY . .

# Puerto de Render
EXPOSE 3000

CMD ["node", "--max-old-space-size=384", "Server.js"]