<comments>
<h2>Comments</h2>
<ul>
  <li each={ comments } class={ state }>
    <blockquote>
      <h4 class="author">{ author }</h4>
      <p class="text">{ text }</p>
    </blockquote>
  </li>
</ul>

<style scoped>
:scope {
  display: block;
  margin-bottom: 4rem;
}

:scope::before {
  content: '';
  display: block;
  height: 1px;
  width: 100%;
  margin: 1rem 0 0 0;
  background-color: #DDD;
}

:scope ul {
  padding: 0;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

:scope li {
  list-style: none;
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
const xhr = require('../js/lib/xhr.js')
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

