riot.tag2('nav', '<ul> <yield></yield> </ul>', 'nav .current,[riot-tag="nav"] .current { text-decoration: underline; }', '', function(opts) {
    var that = this
    this.on('mount', function () {
      _.each(that.root.getElementsByTagName('a'), function (el) {
        if(location.pathname === el.getAttribute('href')) {
          el.className += ' current'
        }
      })
    })
});

