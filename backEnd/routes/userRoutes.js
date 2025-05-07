const express = require('express');
const router = express.Router();
const {registerUser,getAllUsers, loginUser, getMe,updateUserProfile, getUser, addFavorite, removeFavorite} = require('../controllers/userController');
const { get } = require('mongoose');
const { protect } = require('../middlewares/authMiddleware');


router.post('/',registerUser);
router.post('/login',loginUser);
router.get('/me',protect,getMe);
router.get('/',getAllUsers);
router.put('/me',protect,updateUserProfile);
router.get('/:id',getUser);
router.post('/favorites/:assetId', protect, addFavorite);
router.delete('/favorites/:assetId', protect, removeFavorite);
module.exports = router;