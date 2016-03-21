<scrollthingy>
  <div class="content">
    <yield />
  </div>
  <nav class="böttns">
    <li each={ chapters } class="böttns__item">
      <a href="#{url}" class="böttns__link"></a>
    </li>
  </nav>
<style scoped>
:scope {
  position: relative;
  display: block;
}

:scope .content {
  z-index: 1;
  display: block;
  overflow: hidden;
}

:scope .content > section {
  position: relative;
  min-height: 100vh;
  min-width: 100%;
  background-color: white;
}

:scope .böttns {
  z-index: 3;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:scope .böttns__link {
  display: block;
  width: 1rem;
  height: 1rem;
  background-color: hsla(0, 0%, 0%, .6);
  border-radius: 1rem;
  margin: .3rem;
  border: solid 3px hsl(0, 0%, 100%);
  transform: scale(1);
  transition: .2s transform;
}

:scope .böttns__link--active {
  background-color: hsla(0, 0%, 100%, .6);
  border-color: solid 3px hsl(0, 0%, 0%);
  transform: scale(1.2);
}

:scope .böttns {
  list-style: none;
}

:scope section:last-child {
  box-sizing: content-box;
  padding-bottom: 1px;
}

</style>
<script>
const _ = require('lodash')
const domH = require('../js/lib/domHelpers.js')

let scrollLock = true
let dontLock = false

const updatePosition = (factor, heightBefore, elVh, element, lastPos) => {
  let active = false
  let min = elVh * -1
  let pos =
    window.scrollY / factor * -1 + heightBefore
  if (pos < 0 && pos >= min) {
    element.style.transform = `translateY(${pos}vh)`
    active = true
  } else if (pos < min) {
    pos = min
  } else {
    pos = 0
  }
  if (pos === 0 && lastPos !== 0) {
    element.style.transform = 'translateY(0vh)'
  } else if (pos === min && lastPos !== min) {
    element.style.transform = `translateY(${min}vh)`
  }
  return [pos, active]
}

const calcVh = (h) => h / (window.innerHeight / 100)

const calcHeightSum = (elArr) =>
  elArr
    .map((el) => el.clientHeight)
    .reduce((m, n) => n + m, 0)

const updateActive = (el, i, oldChapters) => {
  const name = el.getAttribute('data-name')
  Array.from(this.root.querySelectorAll('.böttns__link'))
    .forEach((el, n) => {
      el.className = i === n
        ? el.className + ' böttns__link--active'
        : el.className.replace(/ böttns__link\-\-active/g, '')
    })
  window.location.href = window.location.href.split('#')[0] + '#' + name
}

this.on('mount', () => {
  // TODO: Add a scrolling animation
  const children = Array.from(this.root.querySelectorAll('.content section'))
  window.addEventListener('hashchange', () => {
    console.log(['scrollLock', scrollLock])
    if (scrollLock) return scrollLock = false
    const hash = window.location.href.split('#')[1]
    let scroll, found
    ; [scroll, found] = children.reduce(
      (mem, el) => [
        mem[1] || el.id === hash
          ? mem[0]
          : mem[0] + el.clientHeight,
        el.id === hash || mem[1]
      ],
      [0, false]
    )
    if (found) {
      window.scroll(0, scroll + 1)
    }
  })
  const chapters = children.map(el => ({
    title: el.getAttribute('data-title'),
    url: el.id
  }))
  let containerHeight = calcHeightSum(children)
  let factor = (window.innerHeight / 100)
  this.update({ chapters })
  this.root.style.height = containerHeight + 'px'
  window.addEventListener('resize', () => {
    factor = (window.innerHeight / 100)
    containerHeight = calcHeightSum(children)
    this.root.style.height = containerHeight + 'px'
  })
  children.forEach((el, i) => {
    const setHeight = () => {
      vh = calcVh(el.clientHeight)
      height = calcVh(calcHeightSum(children.slice(0, i)))
    }
    let height, vh, currPos, active
    el.style.position = 'fixed'
    el.style.zIndex = children.length - i
    setHeight()
    window.addEventListener('resize', setHeight)
    window.addEventListener('scroll', () => {
      let newActive
      ; [currPos, newActive] = updatePosition(factor, height, vh, el, currPos)
      if (newActive && !active) {
        if (dontLock) dontLock = false
        else if(!scrollLock) scrollLock = true
        updateActive(el, i, chapters)
      }
      active = newActive
    })
  })
})
</script>
</scrollthingy>

