const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El campo de usuario del asset es requerido']
    },
    text: {
        type: String,
        required: [true, 'El campo de texto del asset es requerido']
    },
    files: [{
        filename: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    desc:{
        type: String,
        required: [true, 'La descripcion es requerida']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Asset', AssetSchema);