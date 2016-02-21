const csp =
  "default-src 'self' https:;"
  + "style-src 'self' https: 'unsafe-inline';"
  + "script-src 'self' https: 'unsafe-eval' 'unsafe-inline';"
  + "connect-src 'self' raw.githubusercontent.com https: ws: wss:`"

module.exports = function *(next) {
  this.response.set('Strict-Transport-Security', 'strict-transport-security: max-age=31536000; includeSubdomains')
  this.response.set('Content-Security-Policy', csp)
  this.response.set('X-Content-Security-Policy', csp)
  this.response.set('x-frame-options', 'SAMEORIGIN')
  this.response.set('X-XSS-Protection', '1; mode=block')
  this.response.set('X-Content-Type-Options', 'nosniff')
  yield next
}

