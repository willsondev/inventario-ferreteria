const express = require('express');
const router = express.Router();
const Producto = require('../models/producto'); // Asegúrate de tener el nombre correcto del modelo
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');


// Configuración de multer para subir archivos
const upload = multer({ dest: 'uploads/' });

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find().populate('categoria').populate('proveedor');
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, cantidad, categoria, proveedor } = req.body;
    try {
        const nuevoProducto = new Producto({ nombre, descripcion, precio, cantidad, categoria, proveedor });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para filtrar productos por categoría y/o proveedor
router.get('/filtrar', async (req, res) => {
    try {
        let query = {};
        if (req.query.categoria) {
            query.categoria = req.query.categoria;
        }
        if (req.query.proveedor) {
            query.proveedor = req.query.proveedor;
        }

        const productos = await Producto.find(query).populate('categoria').populate('proveedor');
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos filtrados:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para buscar productos por término de búsqueda
router.get('/buscar', async (req, res) => {
    const searchTerm = req.query.query; // Obtener el término de búsqueda desde la query params
    try {
        // Lógica para buscar productos en la base de datos u otro almacenamiento
        // Esto es solo un ejemplo, adapta según tu lógica y base de datos
        const productos = await Producto.find({ nombre: { $regex: searchTerm, $options: 'i' } }); // Ejemplo usando Mongoose
        res.json(productos);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para subir un archivo Excel e importar productos
router.post('/importar', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No se proporcionó ningún archivo');
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheet_name_list = workbook.SheetNames;
        const productos = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        await Producto.insertMany(productos);
        res.send('Productos importados con éxito');
    } catch (error) {
        console.error('Error al importar productos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    } finally {
        // Eliminar el archivo subido después de procesarlo
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
});



module.exports = router;
