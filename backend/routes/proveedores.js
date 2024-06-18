const express = require('express');
const mongoose = require('mongoose');
const Proveedor = require('../models/proveedor');
const Producto = require('../models/producto');
const router = express.Router();

// Validación de entrada para crear un nuevo proveedor
const createProveedorValidator = (req, res, next) => {
    const { nombre, contacto, direccion } = req.body;
    if (!nombre || !contacto) {
        return res.status(400).json({ message: 'Nombre y contacto son campos requeridos' });
    }
    next();
};

// Ruta para obtener todos los proveedores
router.get('/', async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        console.error('Error al obtener los proveedores:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para crear un nuevo proveedor
router.post('/', createProveedorValidator, async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        await nuevoProveedor.save();
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error('Error al crear el proveedor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para eliminar un proveedor por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de proveedor no válido' });
    }

    try {
        const proveedor = await Proveedor.findById(id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        const productosDelProveedor = await Producto.find({ proveedor: id });
        if (productosDelProveedor.length > 0) {
            return res.status(400).json({ message: 'No se puede eliminar el proveedor porque tiene productos asociados.' });
        }

        await Proveedor.findByIdAndDelete(id);
        res.json({ message: 'Proveedor eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
