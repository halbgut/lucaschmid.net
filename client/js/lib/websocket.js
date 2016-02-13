module.exports = () => new Promise((res, rej) => {
  try {
    const proto = window.location.protocol === 'http:' ? 'ws' : 'wss'
    const ws = new window.WebSocket(`${proto}://${window.location.host}`)
    ws.addEventListener('open', e => res(ws))
    ws.addEventListener('error', rej)
  } catch (e) {
    rej(e)
  }
})

