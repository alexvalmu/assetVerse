// Se encarga de manejar las peticiones de los endpoints de la API

const asyncHandler = require("express-async-handler");
const { get, request } = require("http");
const Asset = require("../model/AssetModel");
const User = require("../model/userModel");

const getAsset = asyncHandler( async(req, res) =>{
    const asset = await Asset.find({ user: req.user.id });
    res.status(200).json(asset);
});

const postAsset = asyncHandler (async (req, res, next) => {
    if (!req.body.text) {
        return res.status(400).json({ message: "El campo de texto del asset es requerido" });
    }
    const asset = await Asset.create({
        text : req.body.text,
        user: req.user.id
    });
    res.status(200).json(asset);

    
});


const putAsset = asyncHandler (async(req, res) =>{
    const asset = await Asset.findById(req.params.id);
    if(!asset){
        throw new Error('Asset no encontrado');
    }
    
    
    if(!req.user){
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    if(asset.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('No autorizado');
    }

    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json(updatedAsset);
});

const deleteAsset = asyncHandler (async(req, res) =>{
    
    if(!req.user){
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    if(asset.user.toString() !== req.user.id){
        res.status(401);
        throw new Error('No autorizado');
    }
    
    const asset = await Asset.deleteOne({ _id: req.params.id })
    res.status(200).json(asset);
});


module.exports = {
    getAsset,
    postAsset,
    putAsset,
    deleteAsset
}