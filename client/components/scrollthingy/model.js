import Rx from 'rx'

export default (DOMActions) =>
  Rx.Observable.combineLatest(
    DOMActions.scrollY,
    DOMActions.windowW,
    DOMActions.windowH,
    DOMActions.hashFrag,
    DOMActions.chapters,
    (scrollY, windowW, windowH, hashFrag, chapters) => {
      const vhFactor = windowH / 100
      return {
        windowW,
        windowH,
        contentH: getChapterSum(chapters),
        hashFrag,
        chapters: chapters.map((c, i) => {
          c.topPx = getChapterSum(chapters.slice(0, i))
          c.topVh = c.topPx !== 0 ? c.topPx / vhFactor : 0
          c.heightVh = c.height !== 0 ? c.height / vhFactor : 0
          c.pos = calcTop(scrollY, vhFactor, c.topVh, c.heightVh)
          return c
        })
      }
    }
  )

const getSum = (arr, k) =>
  arr.reduce((m, o) => m + o[k], 0)

const getChapterSum = (chapters) =>
  getSum(chapters, 'height')

const calcTop = (scrollY, vhFactor, topVh, heightVh) => {
  const min = heightVh * -1
  const pos = scrollY / vhFactor * -1 + topVh
  if (pos < min) {
    return min
  } else if (pos > 0) {
    return 0
  } else {
    return pos
  }
}

