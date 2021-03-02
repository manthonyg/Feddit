const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');

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
router.post('/posts', upload.single("image"), async (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  console.log(req.file)

  // try {
    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      imagePath: url + '/images/' + req.file.filename
  });

  const savedPost = await post.save()

  res
  .status(201)
  .json(savedPost)
  });

/**
 * @description Get all posts
 */
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await Post.find()
    res
    .status(200)
    .json(posts);
  }
  catch(error) {
    res
    .status(404)
    .json({
      message: 'Could not find any posts'
    });
  }
});

/**
 * @description
 * Update single post
 */
router.put('/posts/:postId', upload.single("image"), async (req, res, next) => {
    
  const url = req.protocol + '://' + req.get("host");
  console.log(req.file);
  console.log(req.body)
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
  
    await Post.updateOne({_id: req.params.postId}, updatedPost)
    res
    .status(200)
    .json(updatedPost)
});

/**
 * @description
 * Get single post
 */
router.get('/posts/:postId', async (req, res, next) => {
  try {
    const postId = req.params.postId
    const post = await Post.findById(postId)
    res
    .status(200)
    .json(post);
  }
  catch(error) {
    res
    .status(404)
    .json({
      message: 'Could not find that post'
    });
  }
});

/**
 * @description
 * Delete single post
 */
router.delete('/posts', async (req, res, next) => {
  const targetId = req.body._id

  try {
    await Post.deleteOne({_id: targetId})
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
      message: 'Could not delete post'
    });
  }
});


module.exports = router