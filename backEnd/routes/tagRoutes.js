const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/',protect, tagController.createTag);
router.get('/', tagController.getTags);

module.exports = router;
