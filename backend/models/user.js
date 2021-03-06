const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

// create a schema for user
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true}
});


userSchema.plugin(uniqueValidator)

// save this as a mongoose model
module.exports = mongoose.model('User', userSchema);

