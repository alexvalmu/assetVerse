const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getMe,updateUserProfile, getUser} = require('../controllers/userController');
const { get } = require('mongoose');
const { protect } = require('../middlewares/authMiddleware');


router.post('/',registerUser);
router.post('/login',loginUser);
router.get('/me',protect,getMe);
router.put('/me',protect,updateUserProfile);
router.get('/:id',getUser);
module.exports = router;