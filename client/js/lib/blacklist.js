import data from '../../../common/data/blacklist.json'
import aes from '../../../common/lib/aes'
import view from './view'

module.exports = () => {
  let key = []
  window.addEventListener('keydown', e => {
    e.preventDefault()
    key.push(e.keyCode)
    const aesWrap = aes(key)
    if (aesWrap) {
      view('blacklist')
        .then(render => {
          render(aesWrap.decrypt(data))
        })
    }
    try {
    } catch (e) {
      console.error(e)
    }
    console.log(key)
  })
}

