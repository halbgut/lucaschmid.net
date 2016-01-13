<work-in-progress>
  <div if={ commit && recent }>
    <p><b>Work in Progress.</b></p>
    <a target="_blank" href={commit.html_url}>{commit.commit.committer.name}: {commit.commit.message}</a>
  </div>
  <style scoped>
    :scope,
    :scope div {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: block;
      overflow: hidden;
      min-height: 5rem;
      background-color: #EEE;
    }

    :scope div {
      opacity: 1;
      width: 100%;
      padding: 1rem;
      top: 0;
      left: 0;
      transition: opacity .2s;
    }

    :scope > a,
    :scope > p {
      display: block;
      width: 100 %;
    }
  </style>

  <script>
    const that = this
    const api = require('../js/lib/api')
    const dom = require('../js/lib/domHelpers')

    var firstCommit = true

    const tagOnScreen = () => dom.getTopOffset(this.root) > (window.scrollY - this.root.clientHeight)

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
        if(firstCommit || !tagOnScreen()) {
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

  </script>
</work-in-progress>

