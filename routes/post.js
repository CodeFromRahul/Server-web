const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  user:{
   type : mongoose.Schema.Types.ObjectId,
   ref:"user",
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: []
  }
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
