const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// mongoose helps with schemas
const Post = require('./models/post')

// express is nothing but a big funnel of middleware

// Connection URL
const url = 'mongodb://localhost:27017/angular';
const options = { useUnifiedTopology: true, useNewUrlParser: true};


const connectMongoose = async () => {
  try { 
  const connection = await mongoose.connect(url, options)
  console.log(connection, 'connected')
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

app.delete('/api/posts', async (req, res, next) => {
  const targetId = req.body._id

  console.log(targetId)

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




// will export everything 
module.exports = app;

