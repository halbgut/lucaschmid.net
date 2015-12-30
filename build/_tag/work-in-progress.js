riot.tag2('work-in-progress', '<div if="{commit && recent}"> <p><b>Work in Progress.</b></p> <a target="_blank" href="{commit.html_url}">{commit.commit.committer.name}: {commit.commit.message}</a> </div>', 'work-in-progress,[riot-tag="work-in-progress"],work-in-progress div,[riot-tag="work-in-progress"] div { display: block; overflow: hidden; min-height: 5rem; background-color: #EEE; } work-in-progress div,[riot-tag="work-in-progress"] div { width: 100%; padding: 1rem; top: 0; left: 0; transition: opacity .2s; } work-in-progress > a,[riot-tag="work-in-progress"] > a,work-in-progress > p,[riot-tag="work-in-progress"] > p { display: block; width: 100 %; }', '', function(opts) {
    var that = this
    var firstCommit = true

    that.on('update', function () {
      that.update({
        recent: (
          !that.commit
            ? false
            : (new Date).getTime() - (new Date(that.commit.commit.committer.date)).getTime()
              < (86400 * 2 * 1000)
        )
      })
      if(that.commit) {
        if(firstCommit) {
          firstCommit = false
        } else {
          flash(that.root.children[1])
        }
      }
    })

    function flash (el) {
      el.style.opacity = 0
      el.style.position = 'fixed'
      setTimeout(function () { el.style.opacity = 1 , 200 })
      setTimeout(function () {
        el.style.opacity = 0
        setTimeout(function () {
          el.style.position = 'static'
          el.style.opacity = 1
        }, 200)
      }, 4000)
    }

    window.flash = flash

    function requestViaXHR () {
      var req = new XMLHttpRequest
      req.addEventListener('load', function (e) {
        that.update({
          commit: JSON.parse(req.responseText)
        })
      })
      req.open('GET', '/_api/github/json/lastCommit')
      req.send()
    }

    function requestViaWebSockets (err) {
      try {
        var proto = location.protocol === 'https:'
          ? 'wss'
          : 'ws'
        var ws = new WebSocket(proto + '://' + location.host)
        ws.addEventListener('open', function () {
          ws.send('/_api/github/ws/lastCommit')
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

}, '{ }');

