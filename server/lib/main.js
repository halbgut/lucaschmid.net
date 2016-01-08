var fs = require('fs')
var http = require('http')

var express = require('express')
var WebSocketServer = require('websocket').server
var morgan = require('morgan')
var compression = require('compression')

var initTLS = require(`${__dirname}/tls`)
var ratelimiter = require(`${__dirname}/ratelimiter`)()

var api = {}
api.github = require(`${__dirname}/github`)

var NODE_ENV = process.env.NODE_ENV

var ports = NODE_ENV === 'production'
  ? [80, 443]
  : [3442, 3443]

var app = express()
var server = http.createServer(app)

function apiFn (path) {
  return path
    .split('/')
    .slice(1)
    .reduce((mem, val) => val !== 'private' && mem[val] || 0, api)
}

function onSocketReq (req) {
  req.accept(null, null)
}

function onSocketConn (socket) {
  ratelimiter.inc()
  if (ratelimiter.get() >= 100) {
    socket.close(1000, 'Sorry, I\'m over capacity.')
    return
  }
  socket.on('close', ratelimiter.dec)
  socket.on('message', (msg) => {
    var fn
    if (msg.type !== 'utf8') return
    fn = apiFn(msg.utf8Data.substring(1))
    if (fn) {
      fn(socket)
    } else {
      socket.close(1007, 'API method not defined')
    }
  })
}

initTLS('./tls/key.pem', './tls/cert.pem', app, ports[1])
  .then((tlsServer) => {
    var wss = new WebSocketServer({ httpServer: tlsServer })
    wss.on('request', onSocketReq)
    wss.on('connect', onSocketConn)
  })
  .catch(() => {
    var wss = new WebSocketServer({ httpServer: server })
    wss.on('request', onSocketReq)
    wss.on('connect', onSocketConn)
  })

server.listen(ports[0])

// Start watching polling github for commits
api.github.private.watchLastCommit()

// Set up the view system
app.engine('html', (filePath, options, cb) => {
  fs.readFile(filePath, {encoding: 'utf8'}, cb)
})

app.set('view engine', 'html')
app.set('views', './build/_html')

// Set up loging
app.use(morgan('combined'))

// Set up for gzip compression
app.use(compression())

// Set up a static file server
app.use(express.static('./build/'))

// Set some security headers
app.use((req, res, next) => {
  var csp = `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'unsafe-eval' 'self'`
  res.setHeader('Strict-Transport-Security', 'strict-transport-security: max-age=31536000; includeSubdomains')
  res.setHeader('Content-Security-Policy', csp)
  res.setHeader('X-Content-Security-Policy', csp)
  res.setHeader('x-frame-options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})

app.use(/^\/$/, (req, res) => {
  res.render('start')
})

app.use(/^\/projects$/, (req, res) => {
  res.render('projects')
})

app.use(/^\/anotherblog\/?$/, (req, res) => {
  res.render('blog')
})

app.use('/anotherblog/:name', (req, res, next) => {
  res.render(`anotherblog-${req.params.name}`, (err, html) => {
    if (err) next()
    res.send(html)
  })
})

app.use('/_api/', (req, res, next) => {
  var fn = apiFn(req.url)
  fn
    ? fn(req, res, next)
    : next()
})

app.use((req, res) => {
  res.status(404)
  res.render('404')
})

