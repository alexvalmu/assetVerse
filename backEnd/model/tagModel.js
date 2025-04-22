const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // opcional si quieres evitar tags repetidos
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tag', TagSchema);
