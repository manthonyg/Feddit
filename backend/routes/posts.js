const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const { updateNamespaceExportDeclaration } = require("typescript");

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

const upload = multer({ storage: storageLocation })
/** 
 * @description Create a new post
 */
router.post('/posts', checkAuth, upload.single("image"), async (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");

    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId
  });
  try {
    const savedPost = await post.save()
    res
    .status(201)
    .json(savedPost)
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not create post'
    })
  }
});


/**
 * @description Get all posts count
 */
router.get('/posts/count', async (req, res, next) => {

  try {
    const postCount = await Post.count();
    res
    .status(200)
    .json(postCount)
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not get post count'
    })
  }
});


/**
 * @description Get all posts within pagination range in query params
 */
router.get('/posts', async (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find().limit(5);

  if (pageSize && currentPage) {   
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(+pageSize);
  }

  try {
    const posts = await postQuery;

    res
    .status(200)
    .json(posts);
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not get posts'
    })
  }
});

/**
 * @description
 * Update single post
 */
router.put('/posts/:postId', checkAuth, upload.single("image"), async (req, res, next) => {
    
  const url = req.protocol + '://' + req.get("host");
  let imagePath = req.body.imagePath;

  if (req.file) {
    // multer found an image File
      imagePath = url + '/images/' + req.file.filename
  }

    updatedPost = {
      title: req.body.title,
      message: req.body.message,
      imagePath: imagePath
    }
    
    try {
      await Post.updateOne({_id: req.params.postId, creator: req.userData.userId}, updatedPost)
      res
      .status(200)
      .json(updatedPost)
    }
    catch(error) {
      res
      .status(404)
      .json({
        error: 'Could not update post'
      })
    }
});

/**
 * @description
 * Get single post
 */
router.get('/posts/:postId', async (req, res, next) => {
  try {
    const postId = req.params.postId
    const post = await Post.findById({_id: postId})
    res
    .status(200)
    .json(post);
  }
  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not get post'
    })
  }
});

/**
 * @description
 * Delete single post
 */
router.delete('/posts', checkAuth, async (req, res, next) => {
  const targetId = req.body._id

  try {
    await Post.deleteOne({_id: targetId, creator: req.userData.userId})
    res
    .status(200)
    .json({
      message: 'Successfully deleted'
    });
  }

  catch(error) {
    res
    .status(404)
    .json({
      error: 'Could not delete'
    })
    
  }
});


module.exports = router