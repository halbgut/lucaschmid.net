const redirects = [
  ['192.168.99.100/fjs', 'https://github.com/kriegslustig/presentation-functional-javascript'],
  ['ls7.ch/fjs', 'https://github.com/kriegslustig/presentation-functional-javascript']
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

