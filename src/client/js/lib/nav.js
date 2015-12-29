_ = require('lodash')
module.exports = () => {
  _.each(document.querySelectorAll('nav a'), (el) => {
    console.log(el)
    if(location.pathname === el.getAttribute('href')) {
      el.className += ' current'
    }
  })
}

