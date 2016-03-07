<comments>
<ul>
  <li each={ comments } class={ state }>
    <p class="author">{ author }</p>
    <p class="text">{ text }</p>
  </li>
</ul>

<style scoped>
@keyframes pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

:scope li {
  transition: color .6s;
}

:scope .sending {
  animation: pulse 1s 0 infinite alternate;
  color: hsl(50, 0%, 50%);
}

:scope .failed {
  color: hsl(360, 65%, 50%);
}

:scope .sent {
  color: hsl(120, 65%, 50%);
}

</style>

<script>
const xhr = require('../js/lib/xhr')
const post = window.location.href
  .split('/')
  .reverse()[0]

window.comments = this

this.on('mount', () => {
  xhr(`/api/comments/getComments/${post}`)
    .then(JSON.parse)
    .then(comments => this.update({ comments }))
    .catch(err => console.error(err))
})
</script>

</comments>

