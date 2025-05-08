const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');

router.route('/')
  .get(commentController.getComment)
  .post(protect, commentController.postComment);

router.route('/asset/:id')
  .get(commentController.getAssetComments);
module.exports = router;