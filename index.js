let createNanoEvents = () => ({
  events: {},
  emit (event, ...args) {
    for (let i of this.events[event] || []) {
      i(...args)
    }
  },
  on (event, cb) {
    ;(this.events[event] = this.events[event] || []).push(cb)
    return () => (this.events[event] = this.events[event].filter(i => i !== cb))
  },
  off (event, cb) {
    if (cb) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(i => i !== cb)
      }
    } else if (event) {
      this.events[event] = []
    } else {
      this.events = {}
    }
  },
  once (event, cb) {
    let unbind = this.on(event, (...args) => {
      unbind()
      cb(...args)
    })
    return unbind
  }
})

module.exports = { createNanoEvents }
