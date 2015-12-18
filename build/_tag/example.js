riot.tag2('example-riot', '<p>{time}</p>', '', '', function(opts) {
    setInterval(() => {
      this.update({time: new Date})
    }, 1000)
}, '{ }');

