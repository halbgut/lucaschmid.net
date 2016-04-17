import {getHashFrag} from '../../js/lib/domHelpers.js'

import Rx from 'rx'
import RxDOM from 'rx-dom' // eslint-disable-line no-unused-vars

export default (DOM) => ({
  scrollY: Rx.DOM.scroll(window)
    .startWith(0)
    .throttle(33)
    .map((ev) => window.scrollY || window.pageYOffset),
  windowH: Rx.DOM.resize(window)
    .startWith(0)
    .map((ev) => window.innerHeight),
  windowW: Rx.DOM.resize(window)
    .startWith(0)
    .map((ev) => window.innerWidth),
  hashFrag: Rx.DOM.fromEvent(window, 'hashchange')
    .startWith(0)
    .map((ev) => getHashFrag(1, window.location)),
  chapters:
    Rx.Observable.combineLatest(
      getSections()
        .map((elArr) => elArr.map((el) => ({
          name: el.getAttribute('data-name'),
          content: el.innerHTML,
          element: el
        }))),
      Rx.Observable.combineLatest(
        getSections(),
        Rx.DOM.fromEvent(window, 'translated')
          .map((ev) => ev.detail.language),
        (elemArr, lang) => elemArr.map((el) =>
          el
            .querySelector(`[data-lang=${lang}] h1, [data-lang=${lang}] h2`)
            .textContent
        )
      ),
      Rx.Observable.combineLatest(
        getSections(),
        Rx.DOM.resize(window).startWith(0),
        (elArr) => elArr.map((el) => el.clientHeight)
      ),
      (staticAttrs, titles, heights) => staticAttrs.map((s, i) => ({
        content: s.content,
        hashFrag: s.name,
        element: s.element,
        title: titles[i],
        height: heights[i] || 0
      }))
    )
})

const getSections = () =>
  Rx.Observable.from([ [].slice.call(document.querySelectorAll('.scrollthingy__section')) ])

