const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/user/register", async (req, res, next) => {
  try{
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    username: req.body.username,
    password: hash
  });
    const newUser = await user.save()
    res
    .status(201)
    .json(newUser)
   }
   catch(error) {
     res
     .status(404)
     .json({
       message: 'Could not create user'
     });
   }
  });
  
router.post('/user/login', async (req, res, next) => {
  // first figure out if the username exists

  const currentUser = await User.findOne({username: req.body.username})
  if (!currentUser) {
    return res
    .status(401)
    .json({
      message: 'Authentication failed'
    });
  }
    // use the compare method to see if both the password and current user password
    // would yield the same result
    const passwordMatch = await bcrypt.compare(req.body.password, currentUser.password)
    if (!passwordMatch) {
      return res
      .status(404)
      .json({
        message: 'Wrong password'
      });
    }

    // if we make it to here, we can generate a JWT and send it back to the client
    try {
    // create new token and send to client
    const token = jwt.sign(
      {username: currentUser.username, userId: currentUser._id}, 
      'secret_development', 
      {expiresIn: '1h'}
      );
    res
    .status(200)
    .json({
      token: token,
      duration: 3000
    });
  }
  catch(error) {
    res
    .status(401)
    .json({
      message: 'Failed authorization'
    });
  }
  
});
  // bcrypt.hash(req.body.password).then(hash => {
  //   const newUser = User.save({
  //     username: req.body.username,
  //     password: hash
  //   })
  //   res
  //   .status(201)
  //   .json(newUser)
  // })


module.exports = router