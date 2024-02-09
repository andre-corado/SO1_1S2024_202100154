# Usa una imagen base que contenga Node.js
FROM node:20.11-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json a /app
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo (/app)
COPY . .

# Expone el puerto en el que la aplicación se ejecutará dentro del contenedor
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["npm", "start"]
