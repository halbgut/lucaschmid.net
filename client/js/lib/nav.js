const _ = require('lodash')

module.exports = () =>
  Array.from(document.querySelectorAll('nav a'))
    .filter(el =>
      window.location.pathname.split('/')[1] ===
      el.getAttribute('href').split('/')[1]
    )
    .forEach(el =>
      el.classList.add('current')
    )

