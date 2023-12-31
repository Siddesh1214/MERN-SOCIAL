const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: {
    public_id: String,
    url: String,
  },
  caption: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  ],
  comments: [
    {

      type: mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }
  
  ],
  
})

module.exports = mongoose.model('Post', postSchema);