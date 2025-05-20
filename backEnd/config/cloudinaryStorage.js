// config/cloudinaryStorage.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'assets', // carpeta en Cloudinary
      resource_type: 'auto', // permite subir imágenes, videos, etc.
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

module.exports = storage;
