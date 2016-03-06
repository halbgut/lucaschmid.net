<comments>
<ul>
  <li each={ comments }>
    <p class="author">{ author }</p>
    <p class="text">{ text }</p>
  </li>
</ul>

<script>
const xhr = require('../js/lib/xhr')
const post = window.location.href
  .split('/')
  .reverse()[0]

this.on('mount', () => {
  xhr(`/api/comments/getComments/${post}`)
    .then(JSON.parse)
    .then(comments => console.log(comments[0].text) || this.update({ comments }))
    .catch(err => console.error(err))
})
</script>

</comments>

