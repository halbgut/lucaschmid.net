<custom-navigation>
  <ul>
    <li each={ items } data-id={ id } class={ active ? 'active' : '' }>
      <div class="line"></div>
      <a href="{ url }">{ name }</a>
    </li>
  </ul>
  <style scoped>
    :scope {
      position: fixed;
      top: 10rem;
      width: 170px;
      padding: 0 1rem 0 0;
    }

    :scope ul {
      margin-top: 0;
    }

    :scope li {
      display: block;
      position: relative;
      text-align: right;
      margin-bottom: .5rem;
      line-height: 1.2rem;
    }

    :scope li a,
    :scope li a:visited {
      font-size: .8rem;
      color: #AAA;
      transition: color .2s;
    }

    :scope li a:hover,
    :scope li.active a {
      color: #666;
    }

    :scope li .line {
      content: '';
      position: absolute;
      right: -1rem;
      top: 0;
      width: 2px;
      height: 0;
      background: #CCC;
      transition: height .2s, background .2s;
      margin-right: .5rem;
    }

    :scope li:hover .line,
    :scope li.active .line {
      background: #666;
    }

    :scope ul {
      height: 80vh;
    }
  </style>
  <script>
    const _ = require('lodash')
    const dom = require('../js/lib/domHelpers.js')

    const calcPercent = (offset, factor, top) => {
      return Math.round(( offset - top ) / factor)
    }

    const calcPos = () => {
      this.root.style.left = (
          dom.getTopOffset(this.root.parentNode, 'offsetLeft')
          - this.root.clientWidth
      ) + 'px'
    }

    this.items = _.map(document.querySelectorAll('h1'), el => {
      return {
        id: el.id,
        name: el.textContent,
        active: false,
        url: (el.childNodes[0] || {}).href || '#' + el.id,
      }
    })

    this.on('mount', () => {
      calcPos()
      _.each(this.root.getElementsByTagName('li'), (el, i) => {
        const elem = document.getElementById(el.getAttribute('data-id')).parentNode
        const center = innerHeight / 3
        const containerHeight = center > elem.clientHeight
          ? elem.clientHeight
          : elem.clientHeight - innerHeight / 3
        const topOffset = dom.getTopOffset(elem) - center
        const factor = ( containerHeight / 100 )
        const updateBarHeight = _.throttle(e => {
          var res = calcPercent(scrollY, factor, topOffset)
          if(res < 0) res = 0
          if(res > 100) res = 100
          this.items[i].active = !!(res > 0 && res < 100)
          this.update()
          el.children[0].style.height = res + '%'
        }, 30)
        addEventListener('scroll', updateBarHeight)
        updateBarHeight()
      })
    })

    window.addEventListener('resize', calcPos)
  </script>
</custom-navigation>

