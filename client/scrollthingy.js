require('./css/resumeBackgrounds.css')
require('./components/scrollthingy/main.js')

window.requestAnimationFrame(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/build/scrollthingy.css'
  const head = document.getElementsByTagName('head')[0]
  head.parentNode.insertBefore(link, head)
})

