# importamos node
FROM node:20.11-alpine
# se coloca en carpeta front
WORKDIR /front
# se copian archivos base
COPY package.json ./
COPY package-lock.json ./
# se ejecuta npm install
RUN npm install
# se copia el resto
COPY . ./
# se levanta en el puerto 
EXPOSE 5173
# se inicia ejecución
CMD [ "npm", "run", "dev" ]


