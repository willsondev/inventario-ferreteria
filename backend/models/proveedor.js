const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  contacto: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);