const jwt = require('jsonwebtoken');

// custom middleware
module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1] // 2nd word after 'bearer' should be the token
  try {
  console.log(token)
  jwt.verify(token, 'secret_development') // check to see if this is a legit jwt, with our secret 
  next(); // all is good, send request
  } catch(error) {
    res
    .status(401)
    .json({
      message: 'Bad token'
    });
  }

}