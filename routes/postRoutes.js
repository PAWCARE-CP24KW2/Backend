const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const auth = require('../middleware/auth');

// post
router.post('/createPost', auth, upload.single('file'), postController.createPost);
router.get('/getPost', auth, postController.getPost);
router.put('/updatePost/:postId', auth, upload.single('file'), postController.updatePostCon);
router.delete('/deletePost/:postId', auth, postController.deletePostCon);

// like
router.post('/like/:postId', auth, postController.pushLike);
router.delete('/unlike/:postId', auth, postController.unLike);

//comment
router.post('/comment/:postId', auth, postController.createCommentCon);
router.put('/updateComment/:commentId', auth, postController.updateCommentCon);
router.delete('/deleteComment/:commentId', auth, postController.deleteCommentCon);
router.get('/comment/:postId', auth, postController.getCommentsByPostIdCon);

module.exports = router;