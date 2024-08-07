
const mongoose = require('mongoose');

const wofDataSchema = new mongoose.Schema({
    name: String,
    title: String,
    story: String,
    type: String,
    range: String,
    movementSpeed: String,
    Enchantment: String,
    imageURL: String
      // Campo para almacenar la URL de la imagen
});

module.exports = mongoose.model('wofdata', wofDataSchema);
