const asyncHandler = require("express-async-handler");
const Asset = require("../model/AssetModel");
const User = require("../model/userModel");

const getAsset = asyncHandler( async(req, res) =>{
    const asset = await Asset.find();
    res.status(200).json(asset);
});//coge todos los assets sin token de usuario
const getAssetById = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
        res.status(404);
        throw new Error('Asset no encontrado');
    }
    res.status(200).json(asset);
});
const postAsset = asyncHandler(async (req, res, next) => {
    if (!req.body.text) {
        return res.status(400).json({ message: "El campo de texto del asset es requerido" });
    }

    // Procesar archivos si existen
    let files = [];
    if (req.files && req.files.length > 0) {
        files = req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
        }));
    }

    const asset = await Asset.create({
        text: req.body.text,
        user: req.user.id,
        files: files,
        desc: req.body.desc
    });

    res.status(200).json(asset);
});

const putAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
        throw new Error('Asset no encontrado');
    }

    if (!req.user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    if (asset.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('No autorizado');
    }

    // Procesar nuevos archivos si existen
    let newFiles = [];
    if (req.files && req.files.length > 0) {
        newFiles = req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
        }));
    }

    const updateData = {
        ...req.body,
        // Mantener archivos existentes y agregar nuevos
        files: [...asset.files, ...newFiles]
    };

    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedAsset);
});

const deleteAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
        throw new Error('Asset no encontrado');
    }
    if (!req.user) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    if (asset.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('No autorizado');
    }

    await asset.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// Nuevo controlador para manejar archivos individualmente
const deleteFileFromAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.assetId);
    if (!asset) {
        res.status(404);
        throw new Error('Asset no encontrado');
    }

    if (asset.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('No autorizado');
    }

    // Filtrar el archivo a eliminar
    asset.files = asset.files.filter(file => file._id.toString() !== req.params.fileId);
    await asset.save();

    res.status(200).json({ message: 'Archivo eliminado correctamente', asset });
});

module.exports = {
    getAsset,
    postAsset,
    putAsset,
    deleteAsset,
    deleteFileFromAsset,
    getAssetById
};