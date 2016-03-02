'use strict'

const aes = require('aes-js')

const map = (arr, cb) =>
  arr.map(el => {
    let ret = {}
    let key
    for(key in el) {
      ret[key] = cb(el[key])
    }
    return ret
  })

const encode =
  typeof window !== 'undefined'
    ? buff => atob(buff.toString())
    : buff => buff.toString('base64')

const decode =
  typeof window !== 'undefined'
    ? str => btoa(str)
    : str => (new Buffer(str, 'base64')).toString('utf8')

module.exports = (key) => {
  try {
    const aesCtr = new aes.ModeOfOperation.ctr(
      aes.util.convertStringToBytes(key),
      new aes.Counter(5)
    )
    return {
      encrypt (arr) {
        return map(
          arr,
          (str) => encode(aesCtr.encrypt(aes.util.convertStringToBytes(str)))
        )
      },
      decrypt (arr) {
        return map(
          arr,
          (str) => aesCtr.decrypt(aes.util.convertStringToBytes(decode(str)))
        )
      }
    }
  } catch (e) {
    console.error(e)
    return false
  }
}

