const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true
  },
  uAvat: {
    public_id: String,
    url: String,
  }
}, { strictPopulate: false });

module.exports = mongoose.model('Comment', commentSchema);