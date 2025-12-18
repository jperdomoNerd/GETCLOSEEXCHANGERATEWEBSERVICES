#!/usr/bin/env bash
set -o errexit

# Instalar dependencias Node.js
npm install

# Definir rutas del cache de Puppeteer
export PUPPETEER_CACHE_DIR="/opt/render/project/src/.cache/puppeteer"
export XDG_CACHE_HOME="/opt/render/project/.cache"

# Crear los directorios si no existen
mkdir -p "$PUPPETEER_CACHE_DIR"
mkdir -p "$XDG_CACHE_HOME/puppeteer"

# Copiar el cache si ya existe en el build cache
if [[ ! -d "$PUPPETEER_CACHE_DIR/chrome" ]]; then 
  echo "Copiando cache de Puppeteer desde el build cache"
  cp -R "$XDG_CACHE_HOME/puppeteer/." "$PUPPETEER_CACHE_DIR" || true
else 
  echo "Guardando cache de Puppeteer en el build cache"
  cp -R "$PUPPETEER_CACHE_DIR/." "$XDG_CACHE_HOME/puppeteer" || true
fi
