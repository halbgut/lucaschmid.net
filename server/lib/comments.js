const mongoose = require('mongoose')
const ratelimiter = require('./ratelimiter').smart(1)

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
  getComments: post =>
    Comment
      .find({ post: post })
      .then(arr =>
        arr.map(el => ({
          post: el.post,
          text: el.text,
          author: el.author
        }))
      ),
  postComment: com => new Promise((res, rej) => {
    if (!ratelimiter.canDo()) return rej({ message: 'Rate limit exeeded' })
    const comment = (new Comment(com))
    ratelimiter.ping()
    comment
      .validate()
      .then(() => comment.save())
      .then(res)
      .catch(rej)
  })
}

