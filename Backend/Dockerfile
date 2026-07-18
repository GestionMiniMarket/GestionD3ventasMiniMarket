# 1. Imagen base: Node.js versión 20, variante "alpine" 
FROM node:20-alpine

# 2. Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos primero SOLO los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install --production

# 5. Copiamos el resto del código fuente del backend
COPY . .

# 6. Documentamos qué puerto usa la app dentro del contenedor
EXPOSE 3000

# 7. Comando que se ejecuta cuando el contenedor arranca
CMD ["npm", "start"]