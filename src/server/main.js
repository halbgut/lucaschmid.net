var express = require('express')
var fs = require('fs')

var app = express()

app.engine('html', (filePath, options, cb) => {
  fs.readFile(filePath, {encoding: 'utf8'}, cb)
})

app.set('view engine', 'html')
app.set('views', './build/_html')

app.use(express.static('./build/'))

app.use('/', (req, res) => {
  res.render('start')
})
app.listen(3042)

