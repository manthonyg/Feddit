const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PostsController = require('../controllers/posts.controller');
const saveImage = require('../middleware/save-image');

/**
 * @description Create a new post
 */
router.post('/posts', checkAuth, saveImage, PostsController.createPost);

/**
 * @description Get all posts count
 */
router.get('/posts/count', PostsController.getPostCount);

/**
 * @description Get all posts within pagination range in query params
 */
router.get('/posts', PostsController.getPosts);

/**
 * @description
 * Update single post
 */
router.put('/posts/:postId', checkAuth, saveImage, PostsController.updatePost);

/**
 * @description
 * Get single post
 */
router.get('/posts/:postId', PostsController.getPost);

/**
 * @description
 * Delete single post
 */
router.delete('/posts', checkAuth, PostsController.deletePost);

module.exports = router;
