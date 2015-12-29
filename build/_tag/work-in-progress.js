riot.tag2('work-in-progress', '<p><b>Work in Progress.</b></p> <a target="_blank" href="{commit.html_url}">{commit.commit.committer.name}: {commit.commit.message}</a>', 'work-in-progress,[riot-tag="work-in-progress"] { box-sizing: content-box; height: 0; display: block; overflow: hidden; width: calc(100% - 2rem); padding: 0 1rem; background-color: #EEE; transition: height .2s, padding .2s; } work-in-progress.visible,[riot-tag="work-in-progress"].visible { padding: 1rem; } work-in-progress > a,[riot-tag="work-in-progress"] > a,work-in-progress > p,[riot-tag="work-in-progress"] > p { display: block; width: 100 %; }', '', function(opts) {
    var that = this

    that.on('update', function () {
      if(
        !that.commit
          ? undefined
          : (new Date).getTime()
            - (new Date(that.commit.commit.committer.date)).getTime()
            < (86400 * 2 * 1000)
      ) {
        that.root.style.height = (that.root.children[0].clientHeight + that.root.children[1].clientHeight) + 'px'
        that.root.className = 'visible'
      }
    })

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

