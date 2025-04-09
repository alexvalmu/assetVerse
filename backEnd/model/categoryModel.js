const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El campo de texto del asset es requerido']
    },
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);