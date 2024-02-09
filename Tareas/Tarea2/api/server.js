const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/image_upload_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexión a la base de datos exitosa'))
.catch(err => console.error('Error al conectar a la base de datos:', err));

// Definir el esquema para los documentos de la imagen
const imageSchema = new mongoose.Schema({
  imageData: String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

// Definir el modelo para los documentos de la imagen
const Image = mongoose.model('Image', imageSchema);

// Middleware para analizar el cuerpo de las solicitudes como texto
app.use(express.text());

// Habilitar CORS
app.use(cors());

// Ruta para recibir la imagen del frontend y guardarla en MongoDB
app.post('/uploadPhoto', async (req, res) => {
  try {
    const imageData = req.body;
    console.log('\nImagen recibida...\n');

    // Crear un nuevo documento de imagen
    const newImage = new Image({
      imageData: imageData
    });

    console.log('Guardando imagen en la db...\n');

    // Guardar la imagen en la base de datos
    await newImage.save();

    // Enviar una respuesta al frontend
    res.status(200).send('Imagen almacenada correctamente.');
    console.log('La imagen fue almacenada correctamente!\n');
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).send('Ocurrió un error al procesar la imagen.');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`\n\nServidor escuchando en el puerto ${PORT}`);
});
