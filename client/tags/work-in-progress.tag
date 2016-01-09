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
    const that = this
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

    function requestViaXHR (e) {
      const req = new XMLHttpRequest
      console.error(e)
      req.addEventListener('load', function (e) {
        that.update({
          commit: JSON.parse(req.responseText)
        })
      })
      req.open('GET', '/api/github/xhrLastCommit')
      req.send()
    }

    function requestViaWebSockets (err) {
      try {
        const proto = location.protocol === 'http:' ? 'ws' : 'wss'
        const ws = new WebSocket(`${proto}://${location.host}`)
        ws.addEventListener('open', function () {
          ws.send('/api/github/wsLastCommit')
        })
        ws.addEventListener('message', function (e) {
          that.update({
            commit: JSON.parse(e.data)
          })
        })
        ws.addEventListener('close', function (e) {
          err(e)
        })
      } catch (e) {
        err(e)
      }
    }

    requestViaWebSockets(requestViaXHR)

  </script>
</work-in-progress>

