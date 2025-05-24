const asyncHandler = require("express-async-handler");
const Asset = require("../model/AssetModel");
const User = require("../model/userModel");
const path = require("path");
const Tag = require("../model/tagModel");
const Category = require('../model/categoryModel');
const cloudinary = require('../config/cloudinary');


const getAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.find().populate('tags');
  res.status(200).json(asset);
});
const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate('tags');
  if (!asset) {
    res.status(404);
    throw new Error('Asset no encontrado');
  }
  res.status(200).json(asset);
});


const postAsset = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "El campo de título del asset es requerido" });
  }

  if (!req.files.mainImage || req.files.mainImage.length === 0) {
    return res.status(400).json({ message: "El campo de imagen principal es requerido" });
  }

  const mainImagen = req.files.mainImage.map(file => ({
    filename: file.originalname,
    path: file.path, // URL en Cloudinary
    url: file.path,
    public_id: file.filename.split('.')[0], // o file.filename si ya es un ID único
    size: file.size,
    mimetype: file.mimetype,
  }));

  let files = [];
  if (req.files.files && req.files.files.length > 0) {
    files = req.files.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      url: file.path,
      public_id: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    }));
  }

  const tagNames = Array.isArray(req.body.tagNames) ? req.body.tagNames : [req.body.tagNames];
  const existingTags = await Tag.find({ name: { $in: tagNames } });
  const existingTagNames = existingTags.map(tag => tag.name);
  const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));
  const newTags = await Tag.insertMany(newTagNames.map(name => ({ name })), { ordered: false });
  const allTags = [...existingTags, ...newTags];
  const tagIds = allTags.map(tag => tag._id);

  const asset = await Asset.create({
    title: req.body.title,
    user: req.user.id,
    mainImage: mainImagen,
    files: files,
    desc: req.body.desc,
    category: req.body.category.trim().toLowerCase(),
    tags: tagIds,
  });

  res.status(200).json(asset);
});


const putAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404);
    throw new Error('Asset no encontrado');
  }

  if (!req.user || asset.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('No autorizado');
  }

  if (!req.body.title) {
    return res.status(400).json({ message: "El campo de título es requerido" });
  }

  // MAIN IMAGE -------------------------------------------
  let mainImage = asset.mainImage;

  // Si se eliminó la imagen principal
  if (req.body.removeMainImage === 'true') {
    mainImage = null;
    // Opcional: eliminar de Cloudinary si lo deseas
    // await cloudinary.uploader.destroy(asset.mainImage?.public_id);
  }

  // Si se subió una nueva imagen principal
  if (req.files?.mainImage && req.files.mainImage.length > 0) {
    const file = req.files.mainImage[0];
    mainImage = {
      filename: file.originalname,
      path: file.path,
      url: file.path,
      public_id: file.filename.split('.')[0],
      size: file.size,
      mimetype: file.mimetype,
    };
    // Opcional: eliminar la anterior en Cloudinary
    // if (asset.mainImage?.public_id) await cloudinary.uploader.destroy(asset.mainImage.public_id);
  }

  // FILES -------------------------------------------
  let updatedFiles = asset.files;

  // Filtrar los archivos que el usuario quiere conservar
  const remainingFileUrls = Array.isArray(req.body.remainingFileUrls)
    ? req.body.remainingFileUrls
    : req.body.remainingFileUrls
    ? [req.body.remainingFileUrls]
    : [];

  updatedFiles = asset.files.filter(file => remainingFileUrls.includes(file.url));

  // Opcional: eliminar los archivos quitados en Cloudinary
  const removedFiles = asset.files.filter(file => !remainingFileUrls.includes(file.url));
  // for (const file of removedFiles) {
  //   if (file.public_id) await cloudinary.uploader.destroy(file.public_id);
  // }

  // Agregar nuevos archivos
  if (req.files?.files && req.files.files.length > 0) {
    const newFiles = req.files.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      url: file.path,
      public_id: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    }));
    updatedFiles = [...updatedFiles, ...newFiles];
  }

  // TAGS -------------------------------------------
  let tagIds = asset.tags;
  if (req.body.tagNames) {
    const tagNames = Array.isArray(req.body.tagNames) ? req.body.tagNames : [req.body.tagNames];
    const existingTags = await Tag.find({ name: { $in: tagNames } });
    const existingTagNames = existingTags.map(tag => tag.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));
    const newTags = await Tag.insertMany(newTagNames.map(name => ({ name })), { ordered: false }).catch(() => []);
    const allTags = [...existingTags, ...newTags];
    tagIds = allTags.map(tag => tag._id);
  }

  const category = req.body.category?.trim().toLowerCase() || asset.category;

  // FINAL UPDATE -------------------------------------------
  asset.title = req.body.title;
  asset.desc = req.body.desc || asset.desc;
  asset.mainImage = mainImage;
  asset.files = updatedFiles;
  asset.category = category;
  asset.tags = tagIds;

  const updatedAsset = await asset.save();
  res.status(200).json(updatedAsset);
});



const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    return res.status(404).json({ message: 'Asset no encontrado' });
  }

  if (asset.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'No autorizado para eliminar este asset' });
  }

  const publicIds = [];

  if (Array.isArray(asset.mainImage)) {
    asset.mainImage.forEach(file => {
      if (file.public_id) publicIds.push(file.public_id);
    });
  }

  if (Array.isArray(asset.files)) {
    asset.files.forEach(file => {
      if (file.public_id) publicIds.push(file.public_id);
    });
  }

  for (const id of publicIds) {
    try {
      await cloudinary.uploader.destroy(id, { resource_type: 'auto' });
    } catch (err) {
      console.error(`Error eliminando ${id} de Cloudinary`, err);
    }
  }

  // 🔥 Remover asset de favoritos de todos los usuarios
  try {
    const result = await User.updateMany(
      { favorites: asset._id },
      { $pull: { favorites: asset._id } }
    );
    console.log('Usuarios modificados:', result.modifiedCount);
  } catch (err) {
    console.error('Error actualizando favoritos:', err);
  }

  // 🔥 Borrar asset
  try {
    await asset.deleteOne();
    res.status(200).json({ message: 'Asset eliminado correctamente' });
  } catch (err) {
    console.error('Error borrando asset:', err);
    res.status(500).json({ message: 'Error eliminando asset' });
  }
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
  if (!id) {
    return res.status(400).json({ message: "ID de usuario no proporcionado" });
  }
  try {
    const assets = await Asset.find({ user: id });
    if (!assets || assets.length === 0) {
      return res.status(404).json({ message: "No se encontraron assets para este usuario" });
    }

    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAssetByTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  if (!tagId) {
    return res.status(400).json({ message: "El nombre del tag es requerido" });
  }

  // Buscar el Tag por nombre
  const tag = await Tag.findOne({ name: tagId });
  if (!tag) {
    return res.status(404).json({ message: "Tag no encontrado" });
  }

  // Buscar assets que tienen ese tag
  const assets = await Asset.find({ tags: tag._id });
  if (!assets.length) {
    return res.status(404).json({ message: "No se encontraron assets para este tag" });
  }

  res.status(200).json(assets);
});



const getAssetByCategory = asyncHandler(async (req, res) => {
  const { value } = req.params;

  if (!value) {
    return res.status(400).json({ message: "El nombre de la categoría es requerido" });
  }

  // Buscar la categoría por nombre
  const rawValue = decodeURIComponent(value).trim().toLowerCase();
  const category = await Category.findOne({ name: new RegExp(`^${rawValue}$`, 'i') });

  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }

  // Buscar assets que tienen esa categoría
  const assets = await Asset.find({ category: category._id }).populate('tags');
  if (!assets.length) {
    return res.status(404).json({ message: "No se encontraron assets para esta categoría" });
  }

  res.status(200).json(assets);
});

const searchAssets = asyncHandler(async (req, res) => {
  const { user, tag, cat, searchQuery } = req.query;
  const filter = {};

  // Filtrar por user si está presente
  if (user) {
    console.log("user", user);
    filter.user = user;
  }

  // Filtrar por tag si está presente
  if (tag) {
    console.log("tag", tag);
    const foundTag = await Tag.findOne({ name: tag });
    if (!foundTag) {
      return res.status(404).json({ message: "Tag no encontrado" });
    }
    filter.tags = foundTag._id;
  }

  // Filtrar por categoría si está presente
  if (cat) {
    console.log("category", cat);
    const rawCategory = decodeURIComponent(cat).trim().toLowerCase();
    const foundCategory = await Category.findOne({ name: new RegExp(`^${rawCategory}$`, 'i') });
    if (!foundCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    filter.category = foundCategory._id;
  }

  // Filtrar por título si searchQuery está presente
  if (searchQuery) {
    console.log("searchQuery", searchQuery);
    filter.title = new RegExp(searchQuery, 'i');  // 'i' para no diferenciar entre mayúsculas y minúsculas
  }

  // Buscar los assets con los filtros aplicados
  const assets = await Asset.find(filter)
    .populate('tags')
    .populate('category');

  if (!assets.length) {
    return res.status(404).json({ message: "No se encontraron assets con los filtros aplicados" });
  }

  res.status(200).json(assets);
});



module.exports = {
  getAsset,
  postAsset,
  putAsset,
  deleteAsset,
  deleteFileFromAsset,
  getAssetById,
  getUserAssets,
  getAssetByTag,
  getAssetByCategory,
  searchAssets
};