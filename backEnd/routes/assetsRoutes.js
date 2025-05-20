const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const upload = require('../config/multerConfig');
const { protect } = require('../middlewares/authMiddleware');

// Rutas protegidas con JWT y manejo de archivos
router.route('/')
  .get(assetController.getAsset)
  .post(
    protect,
    upload.fields([{ name: 'mainImage' }, { name: 'files' }]),
    assetController.postAsset
  );
  router.get('/search', assetController.searchAssets);

router.route('/:id')
  .put(protect, upload.array('files'), assetController.putAsset)
  .delete(protect, assetController.deleteAsset)
  .get(assetController.getAssetById)

router.route('/user/:id')
  .get(protect, assetController.getUserAssets);

  
router.route('/tags/:tagId')
  .get(assetController.getAssetByTag);

router.route('/categories/:value')
.get(assetController.getAssetByCategory);
// Ruta para eliminar archivos individuales
router.route('/:assetId/files/:fileId')
  .delete(protect, assetController.deleteFileFromAsset);

module.exports = router;