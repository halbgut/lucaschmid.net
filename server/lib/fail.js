module.exports = (err, code) => {
  this.body = `Failed: ${err}`
  this.response.code = code || 500
}

