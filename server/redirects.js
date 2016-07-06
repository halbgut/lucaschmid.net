const redirects = [
  ['ls7.ch/fjs', 'https://github.com/kriegslustig/presentation-functional-javascript'],
  ['ls7.ch/lol', 'https://www.reddit.com/r/gifs/comments/4rj6bx/do_you_want_to_piss_someone_off_open_this/d51ky7z']
]

module.exports = function * (next) {
  const redirect = redirects.find(el =>
    el[0] === `${this.request.host}${this.request.url}`
  )
  if (redirect) {
    this.set('Location', redirect[1])
    this.status = 302
  } else {
    yield next
  }
}

