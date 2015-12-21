var express = require('express')
var morgan = require('morgan')
var fs = require('fs')

var initTLS = require('./tls')

var NODE_ENV = process.env.NODE_ENV

var FQDN = NODE_ENV === 'production'
  ? 'lucaschmid.net'
  : 'localhost'
var ports = NODE_ENV === 'production'
  ? [80, 443]
  : [3442, 3443]

var app = express()
initTLS('./tls/key.pem', './tls/cert.pem', app, ports[1])
app.listen(ports[0])

app.engine('html', (filePath, options, cb) => {
  fs.readFile(filePath, {encoding: 'utf8'}, cb)
})

app.set('view engine', 'html')
app.set('views', './build/_html')

app.use(morgan('common'))

app.use(express.static('./build/'))

app.use('/', (req, res, next) => {
  if(!req.client.TLSSocket && NODE_ENV === 'production') {
    res.writeHead(302, {
      Location: `https://${FQDN}${req.url}`
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

app.use(/^\/anotherblog/, (req, res) => {
  res.render('blog')
})

app.use((req, res) => {
  res.status(404)
    .end()
})

