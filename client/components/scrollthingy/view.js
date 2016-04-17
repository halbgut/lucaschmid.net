import {div, section} from '@cycle/dom'
export default (state$) => state$
  .first((state) =>
    state.chapters.forEach((c) =>
      c.element.parent.removeChild(c.element)
    )
  )
  .map((state) =>
    div(
      {
        className: 'scrollthingy__content',
        style: { zIndex: 2 }
      },
      state.chapters.map((c, i, a) =>
        section({
          key: i,
          className: 'scrollthingy__section',
          style: {
            transform: `translateY(${c.pos}vh)`,
            position: 'fixed',
            zIndex: a.length - i
          },
          dataset: { name: c.hashFrag },
          innerHTML: c.content
        })
      )
    )
  )

