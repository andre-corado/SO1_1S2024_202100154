// server.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Conexión a MongoDB utilizando Mongoose
mongoose.connect('mongodb://localhost:27017/imageDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Definir un esquema y un modelo para la colección de imágenes
const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});
const Image = mongoose.model('Image', imageSchema);

// Ruta para manejar la carga de imágenes
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
    await newImage.save();
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading image');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
