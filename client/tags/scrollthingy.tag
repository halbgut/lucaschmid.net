<scrollthingy>
  <yield />
<style scoped>
:scope {
  position: relative;
  display: block;
}

:scope > section {
  min-height: 100vh;
  min-width: 100%;
  background-color: white;
}
</style>
<script>
const updatePosition = (factor, parentHeight, element, nth, lastPos) => {
  let pos =
    window.scrollY / factor * -1 + 100 * nth
  if (pos < 0)
    element.style.transform = `translateY(${pos}vh)`
  else
    pos = 0
  if (pos === 0 && lastPos !== 0)
    element.style.transform = 'translateY(0vh)'
  console.log([window.scrollY / factor, nth, pos])
  return pos
}

this.on('mount', () => {
  // TODO: Handle resizing
  const children = Array.from(this.root.children)
  let height = this.root.clientHeight
  let factor = (window.innerHeight / 100)
  this.root.style.height = height + 'px'
  children.forEach((el, i) => {
    el.style.position = 'fixed'
    el.style.zIndex = children.length - i
  })
  children.forEach((el, i) => {
    let currPos = undefined
    window.addEventListener('scroll', () => {
      currPos = updatePosition(factor, height, el, i, currPos)
    })
  })
})
</script>
</scrollthingy>

