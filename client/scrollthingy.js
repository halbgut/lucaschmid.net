import Cycle from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'

import { backgrounds } from './css/resumeBackgrounds.css'
import { main, styles } from './components/scrollthingy/main.js'

Cycle.run(
  main,
  { /* Drivers */
    DOM: makeDOMDriver('.scrollthingy')
  }
)

window.requestAnimationFrame(() => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = '/build/scrollthingy.css'
  const head = document.getElementsByTagName('head')[0]
  head.parentNode.insertBefore(link, head)
})

export { styles, backgrounds }

