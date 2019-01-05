// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var ImgSchema   = new mongoose.Schema({
  img: { data: Buffer, contentType: String },
  ref: { type: String, required: true },
  comment: { type: String, required: true },
  color: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  userId: { type: Number, required: true },

});

// Export the Mongoose model
module.exports = mongoose.model('Img', ImgSchema);