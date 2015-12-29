<navigation>
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
    }

    :scope ul {
      margin-top: 0;
    }

    :scope li {
      display: block;
      position: relative;
      text-align: right;
      padding-right: 1rem;
      margin-bottom: .5rem;
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
      right: 0;
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
    var that = this
    this.items = [].map.call(document.querySelectorAll('h1'), function (el) {
      return {
        id: el.id,
        name: el.textContent,
        active: false,
        url: (el.childNodes[0] || {}).href || '#' + el.id,
      }
    })

    this.on('mount', function () {
      calcPos()
      _.each(that.root.getElementsByTagName('li'), function (el, i) {
        var elem = document.getElementById(el.getAttribute('data-id')).parentNode
        var center = innerHeight / 3
        var containerHeight = center > elem.clientHeight
          ? elem.clientHeight
          : elem.clientHeight - innerHeight / 3
        var topOffset = getTopOffset(elem) - center
        var factor = ( containerHeight / 100 )
        var updateBarHeight = _.throttle(function (e) {
          var res = calcPercent(scrollY, factor, topOffset)
          if(res < 0) res = 0
          if(res > 100) res = 100
          that.items[i].active = !!(res > 0 && res < 100)
          that.update()
          el.children[0].style.height = res + '%'
        }, 30)
        addEventListener('scroll', updateBarHeight)
        updateBarHeight()
      })
    })

    addEventListener('resize', calcPos)

    function calcPercent (offset, factor, top) {
      return Math.round(( offset - top ) / factor)
    }


    function getTopOffset (el, prop, n) {
      n = n || 0
      prop = prop || 'offsetTop'
      if(!el.offsetParent) return n
      return getTopOffset(el.offsetParent, prop, n + el[prop])
    }

    function calcPos () {
      that.root.style.right = (
          getTopOffset(that.root.parentNode, 'offsetLeft')
          + that.root.parentNode.clientWidth
      ) + 'px'
    }

  </script>
</navigation>

