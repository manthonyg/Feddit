const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post')

// Connection URL
const url = 'mongodb://localhost:27017/angular';
const options = { useUnifiedTopology: true, useNewUrlParser: true};


const connectMongoose = async () => {
  try { 
  const connection = await mongoose.connect(url, options)
  console.log('connected')
  }
  catch(error) {
    console.log(error, 'not connected')
  }
}

connectMongoose()

app.use((req, res, next) => {
  // set header takes the key (header) and value (value for that header)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE', 'OPTIONS');
  next();
});

app.use(bodyParser.json()) // will return valid express middleware to parse json data
// app.use(bodyParse.urlencoded({extended: true})) // would be for xml encoded stuff

/**
 * @description Create a new post
 */
app.post('/api/posts', async (req, res, next) => {

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
app.get('/api/posts', async (req, res, next) => {
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
app.put('/api/posts/:postId', async (req, res, next) => {

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
app.get('/api/posts/:postId', async (req, res, next) => {
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
app.delete('/api/posts', async (req, res, next) => {
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



module.exports = app;

