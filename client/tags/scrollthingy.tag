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

:scope > section:nth-child(1) {
  background-color: hsl(0, 40%, 80%);
}

:scope > section:nth-child(2) {
  background-color: hsl(20, 40%, 80%);
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
  if (pos >= 0 && lastPos !== 0)
    element.style.transform = 'translateY(0vh)'
  window.requestAnimationFrame(updatePosition.bind(this, factor, parentHeight, element, nth, pos))
}

this.on('mount', () => {
  const height = this.root.clientHeight
  const children = Array.from(this.root.children)
  const factor = ((height - window.innerHeight) / 100)
  this.root.style.height = height + 'px'
  children.forEach((el, i) => {
    el.style.position = 'fixed'
    el.style.zIndex = children.length - i
  })
  window.requestAnimationFrame(() =>
    children.forEach(updatePosition.bind(this, factor, height))
  )
})
</script>
</scrollthingy>

