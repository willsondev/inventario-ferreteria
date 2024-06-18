const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productosRouter = require('./routes/productos');
const categoriasRouter = require('./routes/categorias');
const proveedoresRouter = require('./routes/proveedores');
require('dotenv').config();  // Importar dotenv para manejar variables de entorno

const app = express();

// Conectar a MongoDB Atlas
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB Atlas');
}).catch((error) => {
    console.error('Error al conectarse a MongoDB Atlas:', error);
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/proveedores', proveedoresRouter);

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
