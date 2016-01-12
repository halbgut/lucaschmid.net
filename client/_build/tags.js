riot.tag('custom-navigation', '<ul><li each="{items}" data-id="{id}" class="{active ? \'active\' : \'\'}"><div class="line"></div><a href="{url}">{name}</a></li></ul>', 'custom-navigation, [riot-tag="custom-navigation"]{ position: fixed; top: 10rem; } custom-navigation ul, [riot-tag="custom-navigation"] ul{ margin-top: 0; } custom-navigation li, [riot-tag="custom-navigation"] li{ display: block; position: relative; text-align: right; padding-right: 1rem; margin-bottom: .5rem; } custom-navigation li a, [riot-tag="custom-navigation"] li a,custom-navigation li a:visited, [riot-tag="custom-navigation"] li a:visited{ font-size: .8rem; color: #AAA; transition: color .2s; } custom-navigation li a:hover, [riot-tag="custom-navigation"] li a:hover,custom-navigation li.active a, [riot-tag="custom-navigation"] li.active a{ color: #666; } custom-navigation li .line, [riot-tag="custom-navigation"] li .line{ content: \'\'; position: absolute; right: 0; top: 0; width: 2px; height: 0; background: #CCC; transition: height .2s, background .2s; margin-right: .5rem; } custom-navigation li:hover .line, [riot-tag="custom-navigation"] li:hover .line,custom-navigation li.active .line, [riot-tag="custom-navigation"] li.active .line{ background: #666; } custom-navigation ul, [riot-tag="custom-navigation"] ul{ height: 80vh; }', function(opts) {
    const _ = require('lodash')
    this.items = [].map.call(document.querySelectorAll('h1'), function (el) {
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
        const topOffset = getTopOffset(elem) - center
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

    addEventListener('resize', calcPos)

    const calcPercent = (offset, factor, top) => {
      return Math.round(( offset - top ) / factor)
    }


    const getTopOffset = (el, prop, n) => {
      n = n || 0
      prop = prop || 'offsetTop'
      if(!el.offsetParent) return n
      return getTopOffset(el.offsetParent, prop, n + el[prop])
    }

    const calcPos = () => {
      this.root.style.right = (
          getTopOffset(this.root.parentNode, 'offsetLeft')
          + this.root.parentNode.clientWidth
      ) + 'px'
    }

  
});


riot.tag('example-riot', '<p>{time}</p>', function(opts) {
    setInterval(() => {
      this.update({time: new Date})
    }, 1000)
  
});


riot.tag('work-in-progress', '<div if="{commit && recent}"><p><b>Work in Progress.</b></p><a target="_blank" href="{commit.html_url}">{commit.commit.committer.name}: {commit.commit.message}</a></div>', 'work-in-progress, [riot-tag="work-in-progress"],work-in-progress div, [riot-tag="work-in-progress"] div{ display: block; overflow: hidden; min-height: 5rem; background-color: #EEE; } work-in-progress div, [riot-tag="work-in-progress"] div{ opacity: 1; width: 100%; padding: 1rem; top: 0; left: 0; transition: opacity .2s; } work-in-progress > a, [riot-tag="work-in-progress"] > a,work-in-progress > p, [riot-tag="work-in-progress"] > p{ display: block; width: 100 %; }', function(opts) {
    const that = this
    const api = require('../js/lib/api')
    var firstCommit = true

    that.on('update', function () {
      that.update({
        recent: (
          !that.commit
            ? false
            : (new Date).getTime() - (new Date(that.commit.commit.committer.date)).getTime()
              < (86400 * 2 * 1000) // Last commit hasn't been longer than two days
        )
      })
      if(that.commit) {
        if(firstCommit) {
          firstCommit = false
        } else {
          flash(that.root.children[0], that.root)
        }
      }
    })

    function flash (el, parent) {
      el.style.opacity = 0
      parent.style.height = parent.innerHeight + 'px'
      setTimeout(function () {
        el.style.position = 'fixed'
        el.style.opacity = 1
      }, 200)
      setTimeout(function () {
        el.style.opacity = 0
        setTimeout(function () {
          el.style.position = ''
          el.style.opacity = ''
          parent.style.height = ''
        }, 200)
      }, 4000)
    }

    api('github', 'lastCommit')
      .then(commit => that.update({ commit }))
      .catch(err => { throw err })

  
});


