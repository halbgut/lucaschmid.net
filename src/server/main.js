var fs = require('fs')
var http = require('http')

var express = require('express')
var WebSocketServer = require('websocket').server
var morgan = require('morgan')
var _ = require('lodash')

var initTLS = require(`${__dirname}/tls`)
var getArticles = require(`${__dirname}/../common/getArticles`)
var config = require(`${__dirname}/../common/config.js`)

var api = {}
api.github = require(`${__dirname}/github`)

var NODE_ENV = process.env.NODE_ENV

var FQDN = NODE_ENV === 'production'
  ? config.hostname
  : 'localhost'
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
  socket.on('message', (msg) => {
    var fn
    if(msg.type !== 'utf8') return
    fn = apiFn(msg.utf8Data)
    if(fn) fn(socket)
  })
  //socket.resource)
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

app.engine('html', (filePath, options, cb) => {
  fs.readFile(filePath, {encoding: 'utf8'}, cb)
})

app.set('view engine', 'html')
app.set('views', './build/_html')

app.use(morgan('combined'))

app.use(express.static('./build/'))

app.use('/', (req, res, next) => {
  if(!req.client.encrypted && NODE_ENV === 'production') {
    res.writeHead(302, {
      Location: `${config.defaultProto}://${FQDN}${req.url}`
    })
    res.end()
  } else {
    next()
  }
})

app.use(/^\/$/, (req, res) => {
  res.render('start')
})

app.use(/^\/projects$/, (req, res) => {
  res.render('projects')
})

app.use(/^\/anotherblog$/, (req, res) => {
  res.render('blog')
})

app.use('/anotherblog/:name', (req, res, next) => {
  res.render(`anotherblog-${req.params.name}`, (err, html) => {
    if(err) next()
    res.end(html)
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

