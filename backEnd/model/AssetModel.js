const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El campo de usuario del asset es requerido']
    },
    title: {
        type: String,
        required: [true, 'El campo de título del asset es requerido']
    },
    mainImage: {
        filename: {
            type: String,
            required: true
        },
        url: {
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
    },
    files: [{
        filename: {
            type: String,
            required: true
        },
        url: {
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
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'la categoria es requerida']
    },
    ratingAverage: {
        type: Number,
        default: 0
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Asset', AssetSchema);