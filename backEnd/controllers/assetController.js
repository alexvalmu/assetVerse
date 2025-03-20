// Se encarga de manejar las peticiones de los endpoints de la API

const asyncHandler = require("express-async-handler");
const { get } = require("http");

const getAsset = asyncHandler( async(req, res) =>{
    res.status(200).json({message: 'get all assets'});
});

const postAsset = asyncHandler (async (req, res, next) => {
    if (!req.body.text) {
        return res.status(400).json({ message: "El campo de texto del asset es requerido" });
    }
    res.status(200).json({ message: "Asset created Correctly" });
});


const putAsset = asyncHandler (async(req, res) =>{
    res.status(200).json({message: `Update asset with id: ${req.params.id}`});
});

const deleteAsset = asyncHandler (async(req, res) =>{
    res.status(200).json({message: `Deleted asset with id: ${req.params.id}`});
});


module.exports = {
    getAsset,
    postAsset,
    putAsset,
    deleteAsset
}