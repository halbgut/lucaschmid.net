'use strict'

export let offset = (el, left = false, x = 0) =>
  console.log(el.offsetParent) ||
  el.offsetParent
    ? offset(
      el.offsetParent,
      left,
      x + (
        left
          ? el.offsetLeft
          : el.offsetTop
      )
    )
    : x

