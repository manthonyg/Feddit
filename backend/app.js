const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// express is nothing but a big funnel of middleware

app.use((req, res, next) => {
  // set header takes the key (header) and value (value for that header)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE', 'OPTIONS');
  next();
});

app.use(bodyParser.json()) // will return valid express middleware to parse json data
// app.use(bodyParse.urlencoded({extended: true})) // would be for xml encoded stuff
let POSTS = [
    {id: 1, title: "Test one", message: 'something'},
    {id: 2, title: "Test two", message: 'something else'}
  ] 
app.post('/api/posts', (req, res, next) => {
  const post = req.body
  console.log(post)
  res
  .status(201)
  .json(post)
});

app.get('/api/posts', (req, res, next) => {

  
  res
  .status(200)
  .json(POSTS);
});

app.delete('/api/posts', (req, res, next) => {
  console.log(req.body)
  const newPostList = POSTS.filter(post => post.id !== req.body['id'])
  POSTS = newPostList

  res
  .status(200)
  .json(POSTS);
});




// will export everything 
module.exports = app;

