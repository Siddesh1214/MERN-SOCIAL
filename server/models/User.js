const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required : [true,"Please enter name"]
  },
  avatar: {
    public_id: String,
    url: String,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique:[true,"Email already exists"]
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, "Password must be atleast 6 characters"],
    // select: false
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Post"
    }
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
    
  ],
  
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
    }
  ],

  resetPasswordToken: String,
  resetPasswordExpire:Date,

})

module.exports = mongoose.model('User', userSchema);