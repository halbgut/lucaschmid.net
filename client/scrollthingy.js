import riot from 'riot'
import scrollthingy from './tags/scrollthingy.tag' // eslint-disable-line no-unused-vars
import styles from './css/resumeBackgrounds.css' // eslint-disable-line no-unused-vars

window.requestAnimationFrame(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/build/scrollthingy.css'
  const head = document.getElementsByTagName('head')[0]
  head.parentNode.insertBefore(link, head)
})

riot.mount('*')

