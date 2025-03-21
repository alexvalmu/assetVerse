const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El campo de usuario del asset es requerido']
    },
    text: {
        type: String,
        required: [true, 'El campo de texto del asset es requerido']
    }
},
{
    timestamps: true
});  


module.exports = mongoose.model('Asset', AssetSchema);