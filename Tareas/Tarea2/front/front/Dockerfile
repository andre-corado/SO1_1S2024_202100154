# Usa una imagen base que contenga Node.js
FROM node:20.11-alpine AS builder

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json a /app
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN yarn install

# Copia el resto de los archivos del proyecto al directorio de trabajo (/app)
COPY . .

# Construye la aplicación React para producción
RUN yarn build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos de construcción de la etapa de compilación (builder) al directorio de trabajo de nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]
