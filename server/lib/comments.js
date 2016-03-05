const mongoose = require('mongoose')

mongoose.connect('mongodb://db/lucaschmid-net')

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  post: String
})

const Comment = mongoose.model('Comments', commentSchema)

module.exports = {
  getComments: () => Comments.find(),
  postComment: com => (new Comment(com)).save()
}

