const fs = require('fs')

module.exports = filepath =>
  fs.readFileSync(`${__dirname}/../../${filepath}`)

