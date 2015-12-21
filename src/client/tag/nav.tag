<nav>
  <ul>
    <yield/>
  </ul>
  <style scoped>
    :scope .current {
      text-decoration: underline;
    }
  </style>
  <script>
    var that = this
    this.on('mount', function () {
      _.each(that.root.getElementsByTagName('a'), function (el) {
        if(location.pathname === el.getAttribute('href')) {
          el.className += ' current'
        }
      })
    })
  </script>
</nav>

