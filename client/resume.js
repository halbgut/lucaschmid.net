const riot = require('riot')

require('./tags/translation-switcher.tag')
require('./css/resume.css')

riot.mount('*')

console.log('%cHi!', 'text-decoration: blink; color: black; font-size: 30px; font-family: monospace;')
console.log('You\'re probably here because you want to see some source code.')
console.log('Check it out here: https://github.com/Kriegslustig/lucaschmid.net/blob/master/RESUME.md')
console.log('I hope you\'ll like what you see. :)')

