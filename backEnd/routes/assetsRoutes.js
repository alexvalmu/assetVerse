//Se encarga de controlar las rutas a los controladores

const express = require('express');
const router = express.Router();

const {getAsset,postAsset,putAsset,deleteAsset} = require('../controllers/assetController');

// Para reducir el tamaño de codigo al usar definir las rutas
router.route('/').get(getAsset).post(postAsset);
router.route('/:id').put(putAsset).delete(deleteAsset);



module.exports = router;


