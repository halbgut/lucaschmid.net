riot.tag2('navigation', '<ul> <li each="{items}"><a href="#{id}">{name}</a></li> </ul>', '', '', function(opts) {


    this.items = [{ id: '#el.id', name: 'el.innerHTML' }]
}, '{ }');

