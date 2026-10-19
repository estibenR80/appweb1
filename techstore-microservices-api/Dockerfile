# Imagen base común para todos los microservicios y el gateway.
# El servicio concreto se selecciona con la variable SERVICE_CMD en compose.
FROM node:22-alpine

WORKDIR /app

# Instala dependencias (incluye compilación de better-sqlite3).
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm install --omit=dev || npm install

# Copia el código fuente.
COPY . .

# Crea el directorio de datos.
RUN mkdir -p /app/data

# Comando por defecto (sobrescrito por cada servicio en docker-compose).
CMD ["node", "gateway/src/server.js"]
