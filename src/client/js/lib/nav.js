_ = require('lodash')
module.exports = () => {
  _.each(document.getElementsByTagName('a'), (el) => {
    if(location.pathname === el.getAttribute('href')) {
      el.className += ' current'
    }
  })
}

