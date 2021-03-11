const jwt = require('jsonwebtoken');

// custom middleware
module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]; // 2nd word after 'bearer' should be the token
  try {
    console.log(token);
    // we get the info from within the decoded token (jwt not encrypted)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // check to see if this is a legit jwt, with our secret
    // we pass this on in the request in a property called userData
    req.userData = {
      username: decodedToken.username,
      userId: decodedToken.userId,
    };
    next(); // all is good, send request
  } catch (error) {
    res.status(401).json({
      message: 'Bad token',
    });
  }
};
