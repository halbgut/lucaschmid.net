module.exports = () => {
  Array.from(document.querySelectorAll('*:not(.footnote) > a > sup'))
    .forEach(sup => {
      const note = sup.textContent
      const footnoteElem = document.getElementById(
        'footnote-' + note.substr(1, note.length - 2)
      )
      if (!footnoteElem) return
      const elem = document.createElement('DIV')
      elem.className = 'fancyfootnote'
      elem.innerHTML = footnoteElem.innerHTML
      elem.style.width = document.body.clientWidth + 'px'
      sup.appendChild(elem)
      sup.addEventListener(
        'click',
        e => {
          e.preventDefault()
          elem.classList.toggle('fancyfootnote--on')
        }
      )
    })
}

