<commentform>
<form onsubmit={ submit }>
  <input type="text" name="author" placeholder="Name">
  <textarea name="text" cols="30" rows="5" placeholder="Comment"></textarea>
  <input value="post" type="submit" name="submit">
</form>

<style scoped>
  :scope input,
  :scope textarea {
    font: inherit;
    border: none;
    background: none;
    resize: none;
    width: 100%;
    padding: .5rem;
    margin-bottom: 1rem;
    background-color: hsl(0, 0%, 94%);
    transition: background-color .6s;
    box-shadow: 0 3px 6px hsl(0, 0%, 88%), 0 3px 6px hsl(0, 0%, 76%);
  }

  :scope input[type=text] {
    width: 30%;
  }

  :scope input[type=submit] {
    width: auto;
  }

  :scope input[type=submit]:hover {
    cursor: pointer;
  }

  :scope input:focus,
  :scope textarea:focus,
  :scope input:hover,
  :scope textarea:hover {
    background-color: hsl(0, 0%, 90%);
  }

</style>

<script>
const xhr = require('../js/lib/xhr')
const _ = require('lodash')

submit (e) {
  const data = Array.from(this.root.querySelectorAll('input,textarea'))
    .reduce((mem, el) => {
      if (el.type === 'submit') return mem
      mem[el.name] = el.value
      return mem
    }, {})

  data.post = window.location.href
    .split('/')
    .reverse()[0]

  if (!comments) return console.error('The comments section isn\'t beeing shown so I\'m not posting your comment')
  const comment = _.clone(data)
  const commentsOnServer = _.cloneDeep(comments.comments)
  comment.state = 'sending'
  comments.update({
    comments: comments.comments.concat(comment)
  })


  xhr.post('/api/comments/postComment', data)
    .then(e => {
      comment.state = 'sent'
      comments.update({
        comments: commentsOnServer.concat(comment)
      })
    })
    .catch(e => {
      console.log(e)
      comment.state = 'failed'
      comments.update({
        comments: commentsOnServer.concat(comment)
      })
      setTimeout(() => {
        comments.update({
          comments: commentsOnServer
        })
      }, 2000)
    })

  return false
}
</script>
</commentform>

