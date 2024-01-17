const mongoose = require('mongoose');


const NFSchema = new mongoose.Schema({
 token:String,
  createdAt: { type: Date, default: Date.now },

},{timestamps:true});

module.exports = mongoose.model('Notification', NFSchema);
