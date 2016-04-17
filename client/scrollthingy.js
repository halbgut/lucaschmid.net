import riot from 'riot'
import scrollthingy from './tags/scrollthingy.tag' // eslint-disable-line no-unused-vars
import styles from './css/resumeBackgrounds.css' // eslint-disable-line no-unused-vars

window.requestAnimationFrame(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/build/scrollthingy.css'
  const head = document.getElementsByTagName('head')[0]
  link.addEventListener('load', () => {
    const loader = document.querySelector('.loader')
    setTimeout(() => loader.classList.remove('loader--active'), 1000) // Wait until it really has been rendered
    setTimeout(() => { loader.style.display = 'none' }, 1800)
  })
  head.parentNode.insertBefore(link, head)
})

riot.mount('*')

