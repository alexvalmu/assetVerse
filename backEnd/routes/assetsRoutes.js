//Se encarga de controlar las rutas a los controladores

const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {getAsset,postAsset,putAsset,deleteAsset} = require('../controllers/assetController');

// Para reducir el tamaño de codigo al usar definir las rutas
router.route('/').get(protect,getAsset).post(protect,postAsset);
router.route('/:id').put(protect,putAsset).delete(protect,deleteAsset);



module.exports = router;


