const multer = require('multer');

// custom middleware to save image with multer

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
};

const storageLocation = multer.diskStorage({
  // will be executed whenever multer tries to save a file
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];

    // file path is relative to server
    if (!isValid) {
      throw new Error('Invalid MIME type');
    }
    callback(null, 'images');
  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storageLocation }).single('image');
