<commentform>
<form onsubmit={ submit }>
  <input type="text" name="author" placeholder="Name">
  <textarea name="text" cols="30" rows="10" placeholder="Comment"></textarea>
  <input type="submit" name="submit">
</form>

<script>
const xhr = require('../js/lib/xhr')
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

  xhr.post('/api/comments/postComment', data)
    .then(e => console.log(e))
    .catch(e => console.error(e))

  return false
}
</script>
</commentform>

