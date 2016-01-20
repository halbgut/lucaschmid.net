<work-in-progress>
  <div if={ commit && recent }>
    <p><b>Work in Progress.</b></p>
    <a target="_blank" href={commit.html_url}>{commit.commit.committer.name}: {commit.commit.message}</a>
  </div>
  <style scoped>
    :scope,
    :scope div {
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
    const api = require('../js/lib/api')
    const dom = require('../js/lib/domHelpers')

    var firstCommit = true
    var currentCommit

    const tagOnScreen = () => dom.getTopOffset(this.root) > (window.scrollY - this.root.clientHeight)

    const flash = (el, parent) => {
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

    this.on('update', () => {
      this.update({
        recent: (
          !this.commit
            ? false
            : (new Date).getTime() - (new Date(this.commit.commit.committer.date)).getTime()
              < (86400 * 2 * 1000) // Last commit hasn't been longer than two days
        )
      })
      if (this.commit) {
        if (firstCommit) {
          firstCommit = false
        } else if(!tagOnScreen() && currentCommit !== this.commit.sha) {
          flash(this.root.children[0], this.root)
        }
        currentCommit = this.commit.sha
      }
    })

    api('github', 'lastCommit')
      .then(commit => this.update({ commit }))
      .catch(err => { throw err })

  </script>
</work-in-progress>

