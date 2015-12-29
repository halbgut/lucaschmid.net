riot.tag2('work-in-progress', '<div if="{commit && recent}"> <p><b>Work in Progress.</b></p> <a target="_blank" href="{commit.html_url}">{commit.commit.committer.name}: {commit.commit.message}</a> </div> <div class="flashThingy"></div>', 'work-in-progress,[riot-tag="work-in-progress"] { display: block; overflow: hidden; min-height: 5rem; width: 100%; padding: 1rem; background-color: #EEE; } work-in-progress > a,[riot-tag="work-in-progress"] > a,work-in-progress > p,[riot-tag="work-in-progress"] > p { display: block; width: 100 %; } work-in-progress .flashThingy,[riot-tag="work-in-progress"] .flashThingy { display: none; position: absolute; height: 100%; width: 100%; background: #aac; z-index: 10; opacity: .5; left: 0; top: 0; }', '', function(opts) {
    var that = this

    that.on('update', function () {
      that.update({
        recent: (
          !that.commit
            ? false
            : (new Date).getTime() - (new Date(that.commit.commit.committer.date)).getTime()
              < (86400 * 2 * 1000)
        )
      })
      if(that.commit) flash(that.tags[1])
    })

    function flash (el) {
      el.style.display = 'block'
      setTimeout(() => el.style.display = '' , 150)
    }

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
        ws.addEventListener('open', () => {
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

