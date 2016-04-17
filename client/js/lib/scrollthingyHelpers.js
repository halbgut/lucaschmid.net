const Immutable = require('immutable')

// Math is not my strong suite
const bezier = require('bezier-easing')

const getTitle = (el) =>
  el.querySelector(`[data-lang=${window.translation.lang}] h1,[data-lang=${window.translation.lang}] h2`).innerText

const getChapters = (model) =>
  Immutable.List(
    [].slice.call(
      model.get('root').querySelectorAll('.scrollthingy__section')
    )
  )
    .map((el, i, arr) => Immutable.Map({
      title: getTitle(el),
      url: el.getAttribute('data-name'),
      height: el.clientHeight,
      top: calcVh(calcHeightSum(arr.slice(0, i))),
      topPx: calcHeightSum(arr.slice(0, i)),
      pos: 0,
      vh: calcVh(el.clientHeight),
      element: el, // Not Immutable
      bezier: i + 2 < arr.count()
         ? bezier(0.5, 0, 0, 0.5)
         : null
    }))

const getChapterByUrl = (url, model) =>
  model
    .get('chapters')
    .filter((c) => c.get('url') === url)
    .get(0) ||
  Immutable.Map({})

const updateChapterMaps = (() => {
  let cachedWidth = 0
  return (model, noCache) => {
    let newChapters = model.get('chapters').map((chapter, i, arr) => {
      const newChapter = updatePosition(model, chapter)
      if (!noCache && model.get('width') === cachedWidth) return newChapter
      const height = newChapter.get('element').clientHeight
      const top = calcHeightSum(arr.slice(0, i))
      return newChapter
        .set('vh', calcVh(height))
        .set('height', height)
        .set('top', calcVh(top))
        .set('topPx', top)
    })
    cachedWidth = model.get('width')
    return newChapters
  }
})()

const updateChapterTitles = (model) =>
  model.update('chapters', (chapters) =>
    chapters.map((chapter) =>
      chapter.set('title', getTitle(chapter.get('element')))
    )
  )

const updatePosition = (model, chapter) => {
  const min = chapter.get('vh') * -1
  let pos =
    model.get('scrollY') / model.get('factor') * -1 + chapter.get('top')
  if (pos < min) {
    pos = min
  } else if (pos > 0) {
    pos = 0
  } else {
    const algo = chapter.get('bezier')
    if (algo) pos = algo(pos / min) * min
  }
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
      ) {
        actions[k](el, model, parentModel)
      }
    })
    cachedModel = model
    return model
  }
}

const calcVh = (h) => h / (window.innerHeight / 100)

const calcHeightSum = (elArr) =>
  elArr
    .map((el) => (el.get ? el.get('element') : el).clientHeight)
    .reduce((m, n) => n + m, 0)

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

export {
  getChapters,
  getChapterByUrl,
  updateChapterMaps,
  updater,
  calcHeightSum,
  lazyArrayUpdater,
  initializeSectionStyles,
  getCurrentChapter,
  updateChapterTitles
}

