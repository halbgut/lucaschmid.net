<work-in-progress class={ commit && hasnt_been_long ? 'visible' : '' }>
  <p><b>Work in Progress.</b></p>
  <a target="_blank" href={commit.html_url}>{commit.commit.committer.name}: {commit.commit.message}</a>

  <style scoped>
    :scope {
      padding: 1rem;
      background-color: #EEE;
      transition: opacity .2s .2s;
    }
    :scope.visible {
      opacity: 1;
    }
  </style>

  <script>
    var that = this
    var req = new XMLHttpRequest
    req.addEventListener('load', function (e) {
      that.update({
        commit: JSON.parse(req.responseText)
      })
    })
    req.open('GET', '/_api/github/lastCommit')
    req.send()
    that.on('update', function () {
      if(that.hasnt_been_long !== undefined) return
      that.update({
        hasnt_been_long: !that.commit
          ? undefined
          : (new Date).getTime()
            - (new Date(that.commit.commit.committer.date)).getTime()
            < (86400 * 2 * 1000) // Last commit hasn't been longer than two days
      })
    })
  </script>
</work-in-progress>

