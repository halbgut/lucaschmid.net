#!/usr/bin/env node

const fs = require('fs')
const aes = require('../../common/lib/aes')
const config = require('../config.json')

const arg = process.argv[2]

if (!fs.statSync(arg)) process.exit()
const enc = JSON.stringify(
  aes(config.blacklistKey)
    .encrypt(
      JSON.parse(fs.readFileSync(arg))
    )
)

process.stdout.write(`${enc}\n`)
process.exit()

