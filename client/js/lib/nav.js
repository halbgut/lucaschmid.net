import _ from 'lodash'

module.exports = () => {
  _.each(document.querySelectorAll('nav a'), (el) => {
    if (
      window.location.pathname.split('/')[1] ===
      el.getAttribute('href').split('/')[1]
    ) {
      el.className += ' current'
    }
  })
}

