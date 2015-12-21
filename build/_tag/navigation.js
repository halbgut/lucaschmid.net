riot.tag2('navigation', '<ul> <li data-id="{id}" each="{items}"> <div class="line"></div> <a href="#{id}">{name}</a> </li> </ul>', 'navigation,[riot-tag="navigation"] { position: fixed; top: 4.7rem; } navigation ul,[riot-tag="navigation"] ul { margin-top: 0; } navigation li,[riot-tag="navigation"] li { display: block; position: relative; text-align: right; padding-right: 1rem; margin-bottom: .5rem; } navigation li a,[riot-tag="navigation"] li a,navigation li a:visited,[riot-tag="navigation"] li a:visited { font-size: .8rem; color: #AAA; } navigation li a:hover,[riot-tag="navigation"] li a:hover { color: #999; } navigation li .line,[riot-tag="navigation"] li .line { content: \'\'; position: absolute; right: 0; top: 0; width: 2px; height: 0; background: #CCC; transition: height .2s; margin-right: .5rem; } navigation ul,[riot-tag="navigation"] ul { height: 80vh; }', '', function(opts) {
    var that = this
    this.items = [].map.call(document.querySelectorAll('h1'), function (el) {
      return { id: el.id, name: el.textContent }
    })

    this.on('mount', function () {
      calcPos()
      _.each(that.root.getElementsByTagName('li'), function (el) {
        var elem = document.getElementById(el.getAttribute('data-id')).parentNode
        var topOffset = getTopOffset(elem)
        var factor = ( elem.clientHeight / 100 )
        var boundCalcPercent = calcPercent(topOffset, factor, false, scrollY) >= 100
          ? calcPercent.bind(null, topOffset, factor, true)
          : calcPercent.bind(null, topOffset, factor, false)
        var updateBarHeight = _.throttle(function (e) {
          var res = boundCalcPercent(scrollY)
          if(res < 0) res = 0
          if(res > 100) res = 100
          el.children[0].style.height = res + '%'
        }, 30)
        addEventListener('scroll', updateBarHeight)
        updateBarHeight()
      })
    })

    addEventListener('resize', calcPos)

    function calcPercent (offset, factor, fromTop, top) {
      var add = fromTop
        ? 0
        : innerHeight
      return Math.round(( top - offset + add ) / factor)
    }

    function getTopOffset (el, prop, n) {
      n = n || 0
      prop = prop || 'offsetTop'
      if(!el.offsetParent) return n
      return getTopOffset(el.offsetParent, prop, n + el[prop])
    }

    function calcPos () {
      var main = that.root.parentNode.parentNode.children[1]
      that.root.style.right = (
          getTopOffset(main, 'offsetLeft')
          + main.clientWidth
      ) + 'px'
    }

}, '{ }');

