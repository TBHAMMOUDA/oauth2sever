// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var ImgSchema   = new mongoose.Schema({
  img: { data: Buffer, contentType: String }
});

// Export the Mongoose model
module.exports = mongoose.model('Img', ImgSchema);