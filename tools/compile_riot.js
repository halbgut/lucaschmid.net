#!/usr/bin/env node
var riot = require('riot')
var fs = require('fs')

var tag = fs.readFileSync(process.argv[2], 'utf8')

process.stdout.write(riot.compile(tag))

