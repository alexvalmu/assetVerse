const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto';
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.pdf' || ext === '.zip' || ext === '.docx' || ext === '.blend') {
      resourceType = 'raw';
    }

    return {
      folder: 'assets',
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

module.exports = storage;
