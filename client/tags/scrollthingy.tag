<scrollthingy>
  <div class="content">
    <yield />
  </div>
  <nav class="böttns">
    <li each={ chapters } class="böttns__item">
      <a
        onclick={hashchange}
        href="#{get('url')}"
        class={ böttns__link: true, böttns__link--active: active === get('url') }
      ></a>
    </li>
  </nav>
<script>

const _ = require('lodash')
const domH = require('../js/lib/domHelpers.js')
const Immutable= require('immutable')

let hashchanged = false

this.on('mount', () => {
  // TODO: Add a scrolling animation
  const model = Immutable.Map({
    scrollY: window.scrollY,
    windowH: window.innerHeight,
    hash: window.location.hash.substr(1),
    height: this.root.clientHeight,
    root: this.root,
    factor: window.innerHeight / 100,
    chapter: undefined,
    events: Immutable.Map({
      load: true,
      firstUpdate: false,
      hashchange: false
    })
  })

  const render = updater({
    hash: (hash) => { domH.updateHash(hash) },
    chapters: lazyArrayUpdater({
      pos: (pos, el) => {
        el.get('element').style.transform = `translateY(${pos}vh)`
      },
    }),
    height: (height, model) => { model.get('root').style.height = height + 'px' },
    chapter: updater({
      url: (url) => {
        this.update({ active: url })
        domH.updateHash(url)
      }
    }, Immutable.Map()),
    events: updater({
      firstUpdate: (firstUpdate, events, model) => {
        if (!firstUpdate) return
        this.update({ chapters: model.get('chapters').slice(0, -1).toArray() })
        window.scrollTo(0, model.get('chapter').get('topPx'))
      },
      hashchange: (hashchange, events, model) => {
        const chapter = model
          .get('chapters')
          .filter((c) => c.get('url') === model.get('hash'))
          .get(0)
        if (chapter) window.scrollTo(0, chapter.get('topPx'))
      }
    }, Immutable.Map({}))
  }, Immutable.Map({}))

  const update = (model) => {
    let newModel = model.update('chapters', updateChapterMaps.bind(null, model))

    // Event handling
    let load = newModel.get('events').get('load')
    newModel = newModel.update('events', (events) => events.map(() => false))
    if (load) {
      newModel = newModel
        .update('chapters', initializeSectionStyles)
        .update('events', (events) => events.set('firstUpdate', true))
    }
    if (hashchanged) {
      hashchanged = false
      if (window.location.hash !== newModel.get('hash'))
        newModel = newModel
          .set('hash', window.location.hash)
          .update('events', (events) => events.set('hashchange', true))
    }

    return (
      newModel
        .set('scrollY', window.scrollY)
        .set('windowH', window.innerHeight)
        .set('hash', window.location.hash.substr(1))
        .set( 'height', calcHeightSum(model.get('chapters')) )
        .set('factor', window.innerHeight / 100)
        .set('chapter', getCurrentChapter(newModel))
        .set('width', window.innerWidth)
    )
  }

  const loop = (model) =>
    requestAnimationFrame(() =>
      loop(update(render(model)))
    )

  loop( model.set('chapters', getChapters(model)) )
})

this.hashchange = (e) => {
  setTimeout(() => { hashchanged = true }, 0)
  return true
}

const getChapters = (model) =>
  Immutable.List(
    Array.from(
      model.get('root').querySelectorAll('.content section')
    )
  )
    .map((el, i, arr) => Immutable.Map({
      title: el.getAttribute('data-title'),
      url: el.getAttribute('data-name'),
      height: el.clientHeight,
      top: calcVh(calcHeightSum(arr.slice(0, i))),
      topPx: calcHeightSum(arr.slice(0, i)),
      pos: 0,
      vh: calcVh(el.clientHeight),
      element: el // Not Immutable
    }))

const updateChapterMaps = (() => {
  let cachedWidth = 0
  return (model, chapters) => {
    let newChapters = chapters.map((chapter, i, arr) => {
      const newChapter = updatePosition(model, chapter)
      if (model.get('width') === cachedWidth) return newChapter
      const height = newChapter.get('element')
      const top = calcHeightSum(arr.slice(0, i))
      return newChapter
        .set('vh', calcVh(height))
        .set('heigt', height)
        .set('top', calcVh(top))
        .set('topPx', top)
    })
    cachedWidth = model.get('width')
    return newChapters
  }
})()

const updatePosition = (model, chapter) => {
  const min = chapter.get('vh') * -1
  let pos =
    model.get('scrollY') / model.get('factor') * -1 + chapter.get('top')
  if (pos < min) pos = min
  if (pos > 0) pos = 0
  return chapter.set('pos', pos)
}

const updater = (actions, model) => { // This function is used to produce side-effects
  let cachedModel = model
  return (model, parentModel) => {
    model.forEach((el, k) => {
      if (
        actions[k] &&
        (
          typeof el === 'object' ||
          el !== cachedModel.get(k)
        )
      ) actions[k](el, model, parentModel)
    })
    return cachedModel = model
  }
}

const calcVh = (h) => h / (window.innerHeight / 100)

const calcHeightSum = (elArr) =>
  elArr
    .map((el) => el.clientHeight || el.get('element').clientHeight)
    .reduce((m, n) => n + m, 0)

const updateActive = (el, i) => {
  const name = el.getAttribute('data-name')
  Array.from(this.root.querySelectorAll('.böttns__link'))
    .forEach((el, n) => {
      el.className = i === n
        ? el.className + ' böttns__link--active'
        : el.className.replace(/ böttns__link\-\-active/g, '')
    })
  window.location.href = window.location.href.split('#')[0] + '#' + name
}

const lazyArrayUpdater = (actions) => {
  const cache = {}
  return (arr) => {
    arr.forEach((el, k) => {
      (cache[k] || (cache[k] = updater(actions, el, arr)))(el)
    })
  }
}

const initializeSectionStyles = (chapters) => {
  chapters.forEach((chapter, i, arr) => {
    chapter.get('element').style.position = 'fixed'
    chapter.get('element').style.zIndex = arr.count() - i
  })
  return chapters
}

const getCurrentChapter = (model) => {
  const pos = model.get('scrollY')
  return model.get('chapters').filter((el) =>
    el.get('topPx') <= pos &&
    el.get('topPx') + el.get('height') > pos
  ).get(0) || Immutable.Map()
}

</script>
<style scoped>
:scope {
  position: relative;
  display: block;
}

:scope .content {
  z-index: 1;
  display: block;
  height: 100%;
  overflow: hidden;
  position: relative;
}

:scope section {
  position: relative;
  min-height: 100vh;
  min-width: 100%;
  background-color: white;
}

:scope .böttns {
  z-index: 1;
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

:scope section:nth-last-child(2) {
  box-shadow: 0 -14px 30px 14px black;
}

:scope .footer {
  min-height: 10vh;
  bottom: 0;
}

:scope .footer__center {
  color: #000;
  width: 100%;
  text-align: center;
  line-height: 2rem;
}

:scope .footer__center a {
  color: blue;
}

</style>
</scrollthingy>

