module.exports = (err, code) => {
  console.error(err)
  this.body = `Failed: ${err}`
  this.response.code = code || 500
}

