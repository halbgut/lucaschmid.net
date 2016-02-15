module.exports = (context, err, code) => {
  console.error(err)
  context.body = `Failed: ${err}`
  context.response.status = code || 500
}

