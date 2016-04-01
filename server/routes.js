'use strict'

const dns = require('dns')

const github = require('./lib/github')
const comments = require('./lib/comments')
const view = require('./lib/view')
const fail = require('./lib/fail')
const webdevquiz = require('./lib/webdevquiz')
const getMarkdown = require('./lib/getMarkdown')
const pug = require('../common/lib/pug')
const parallelPromise = require('../common/lib/parallelPromise')

var feeds

// Feed cache
require('./lib/feeds')
  .then((res) => { feeds = res })

module.exports = {
  post: {
    '/api/comments/postComment': (context) => new Promise((resolve, reject) => {
      comments.postComment(context.request.body)
        .then((data) => {
          context.status = 200
          context.body = data
          resolve()
        })
        .catch((err) => {
          context.status = 400
          context.body = err
          resolve()
        })
    })
  },
  get: {
    '/api/github/xhr/:command': (context) => new Promise((resolve, reject) => {
      if (github.xhr[context.params.command]) {
        github.xhr[context.params.command]()
          .then((json) => {
            context.body = json
            resolve()
          })
          .catch((err) => resolve(fail(context, err)))
      } else {
        reject()
      }
    }),
    '/api/comments/getComments/:post': (context) =>
      comments.getComments(context.params.post)
        .then((data) => {
          context.body = data
          context.status = 200
        }),
    '/api/view/xhr/:name': (context) => new Promise((resolve, reject) => {
      view.xhr(context.params.name)
        .then((html) => {
          context.body = html
          context.response.type = 'text/plain'
          resolve()
        })
        .catch((e) => {
          console.error(e)
          reject()
        })
    }),
    '/api/md/:name': (context) =>
      getMarkdown(context.params.name)
        .then((mdArr) => {
          context.body = mdArr
          context.status = 200
        })
        .catch((err) => fail(context, err)),
    '/feed/:type': (context) => new Promise((resolve, reject) => {
      context.type = 'text/xml'
      if (context.params.type === 'atom.xml') {
        context.body = feeds[0]
        resolve()
      } else if (context.params.type === 'rss.xml') {
        context.body = feeds[1]
        resolve()
      } else {
        reject()
      }
    }),
    '/webdevquiz': (context) => new Promise((resolve, reject) => {
      webdevquiz(context)
      resolve()
    }),
    '/ip': (context) => new Promise((resolve, reject) => {
      let addr = context.req.connection.remoteAddress
      context.status = 200
      if (addr.substr(7).match(/^(\d{1,3}\.){3}\d{1,3}$/)) addr = addr.substr(7)
      dns.reverse(addr, (err, name) => {
        context.body = `${addr}\n${name || err.code}`
        resolve()
      })
    }),
    '/resume-wimdu': (context) => new Promise((resolve, reject) => {
      parallelPromise([
        getMarkdown('resume/*/*'),
        view.private.getTemplate('resume', false)
      ])
        .then((res) => {
          context.status = 200
          context.body = pug(res[1])({ chapters: res[0] })
          resolve()
        })
        .catch((err) => resolve(fail(context, err)))
    })
  }
}

