const mongoose = require('mongoose')

mongoose.connect('mongodb://db/lucaschmid-net')

const commentSchema = new mongoose.Schema({
  author: {
    required: true,
    type: String
  },
  text: {
    required: true,
    type: String
  },
  post: {
    required: true,
    type: String
  }
})

const Comment = mongoose.model('Comments', commentSchema)

module.exports = {
  getComments: post => Comment.find({ post: post }),
  postComment: com => new Promise((res, rej) => {
    const comment = (new Comment(com))
    comment
      .validate()
      .then(() => comment.save())
      .then(res)
      .catch(rej)
  })
}

