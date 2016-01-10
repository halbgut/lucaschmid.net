module.exports = {
  '/{p*}': params [
    '404',
    () => new Promise(res => res({}))
  ]
}

