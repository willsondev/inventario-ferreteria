const express = require('express');
const Categoria = require('../models/categoria'); // Asegúrate de que el modelo esté correctamente requerido
const router = express.Router();

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear una nueva categoría
router.post('/', async (req, res) => {
    const { nombre } = req.body;
    try {
        const nuevaCategoria = new Categoria({ nombre });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar una categoría por ID
router.delete('/:categoriaId', async (req, res) => {
    const categoriaId = req.params.categoriaId;
    try {
        const categoriaEliminada = await Categoria.findByIdAndDelete(categoriaId);
        if (!categoriaEliminada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
