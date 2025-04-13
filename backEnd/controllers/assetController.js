const asyncHandler = require("express-async-handler");
const Asset = require("../model/AssetModel");
const User = require("../model/userModel");
const path = require("path");

const getAsset = asyncHandler( async(req, res) =>{
    const asset = await Asset.find();
    res.status(200).json(asset);
});
const getAssetById = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
        res.status(404);
        throw new Error('Asset no encontrado');
    }
    res.status(200).json(asset);
});
const postAsset = asyncHandler(async (req, res, next) => {
    if (!req.body.title) {
        return res.status(400).json({ message: "El campo de título del asset es requerido" });
    }
    // Procesar archivos si existen
    let files = [];
    if (req.files && req.files.length > 0) {
        files = req.files.map(file => ({
            filename: file.filename,
            path: path.relative(process.cwd(), file.path),
            size: file.size,
            mimetype: file.mimetype
        }));
    }
    if(req.files.mainImage && req.files.mainImage.length > 0){
        mainImagen= req.files.mainImage.map(file => ({
            filename: file.filename,
            path: path.relative(process.cwd(), file.path),
            size: file.size,
            mimetype: file.mimetype
        }));
    }else{
        return res.status(400).json({ message: "El campo de imagen principal es requerido" });
    }

    const asset = await Asset.create({
        title: req.body.title,
        user: req.user.id,
        mainImage: mainImagen,
        files: files,
        desc: req.body.desc,
        category: req.body.category
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
            filename: file.filename,
            path: path.relative(process.cwd(), file.path),
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

const getUserAssets = asyncHandler(async (req, res) => {
    const { id } = req.params; // ID del usuario

    try {
        const assets = await Asset.find({ user: id }); // Puedes hacer populate si quieres traer info de la categoría también
        console.log(id);
        if (!assets || assets.length === 0) {
            return res.status(404).json({ message: "No se encontraron assets para este usuario" });
        }

        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    getAsset,
    postAsset,
    putAsset,
    deleteAsset,
    deleteFileFromAsset,
    getAssetById,
    getUserAssets
};