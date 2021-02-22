const express = require("express")
const router = express.Router();
const Post = require('../models/post')
/** 
 * @description Create a new post
 */
router.post('/posts', async (req, res, next) => {

  try {
    const post = new Post({
    title: req.body.title,
    message: req.body.message
  })

  const savedPost = await post.save()

  res
  .status(201)
  .json(savedPost)
  }
  catch(error) {
    res
    .status(404)
    .json({
      message: "Could not create post"
    });
  }
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
router.put('/posts/:postId', async (req, res, next) => {

  try {
    const updatedPost = await Post.updateOne({_id: req.params.postId}, req.body)
    res
    .status(200)
    .json(updatedPost)
  }
  catch(error) {
    console.log(error)
    res.status(404)
    .json({
      message: 'Could not update post'
    });
  }
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