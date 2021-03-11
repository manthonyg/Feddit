const mongoose = require('mongoose');

// create a schema for post

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

// save this as a mongoose model
module.exports = mongoose.model('Post', postSchema);
