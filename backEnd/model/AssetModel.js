const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'El campo de texto del asset es requerido']
    }
},
{
    timestamps: true
});  


module.exports = mongoose.model('Asset', AssetSchema);