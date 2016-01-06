var _ = require('lodash')

module.exports = () => {
  _.each(document.querySelectorAll('nav a'), (el) => {
    if (window.location.pathname === el.getAttribute('href')) {
      el.className += ' current'
    }
  })
}

