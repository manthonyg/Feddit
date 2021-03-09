const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const PostsController = require("../controllers/posts.controller");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg'
}

const storageLocation = multer.diskStorage({
  // will be executed whenever multer tries to save a file
  destination: (request, file, callback) => {

    const isValid = MIME_TYPE_MAP[file.mimetype]

    // file path is relative to server 
    if (!isValid) {
      throw new Error('Invalid MIME type')
    }
    callback(null, "backend/images");

  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
  
    const extension = MIME_TYPE_MAP[file.mimetype]
    callback(null, name + '-' + Date.now() + '.' + extension)
    }
});

const upload = multer({ storage: storageLocation });

/** 
 * @description Create a new post
 */
router.post('/posts', checkAuth, upload.single("image"), PostsController.createPost);


/**
 * @description Get all posts count
 */
router.get('/posts/count',  PostsController.getPostCount);


/**
 * @description Get all posts within pagination range in query params
 */
router.get('/posts', PostsController.getPosts); 


/**
 * @description
 * Update single post
 */
router.put('/posts/:postId', checkAuth, upload.single("image"), PostsController.updatePost);

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


module.exports = router