const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware para aumentar el límite de tamaño de carga útil (payload) a 50 MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para permitir solicitudes de otros orígenes (CORS)
app.use(cors());

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

const Image = mongoose.model('Image', imageSchema);

// Ruta para recibir y almacenar la imagen
app.post('/upload', async (req, res) => {
  try {
    // Verificar si se recibió la imagen en formato base64
    if (!req.body.imageData) {
      return res.status(400).json({ error: 'La imagen en base64 es requerida' });
    }

    // Crear un nuevo documento de imagen
    const newImage = new Image({
      imageData: req.body.imageData
    });

    // Guardar la imagen en la base de datos
    await newImage.save();

    // Devolver una respuesta exitosa
    res.status(200).json({ message: 'Imagen almacenada correctamente' });
  } catch (error) {
    console.error('Error al almacenar la imagen:', error);
    res.status(500).json({ error: 'Ocurrió un error al almacenar la imagen' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
