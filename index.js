/**
 * Interface for event subscription.
 *
 * @example
 * class Ticker {
 *   constructor() {
 *     this.emitter = new NanoEvents()
 *   }
 *   on() {
 *     return this.emitter.on.apply(this.events, arguments)
 *   }
 *   once() {
 *     return this.emitter.once.apply(this.events, arguments)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 *
 * @class
 */
module.exports = function NanoEvents () {
  /**
   * Event names in keys and arrays with listeners in values.
   * @type {object}
   */
  this.events = { }
}

function add (events, event, cb) {
  var added = true
  var l = { fn: cb }

  l.rm = function () {
    if (!added) return
    added = false
    var list = events[event]
    if (list.length > 1) {
      list.splice(list.indexOf(l), 1)
    } else {
      delete events[event]
    }
  }

  if (events[event]) {
    events[event].push(l)
  } else {
    events[event] = [l]
  }
  return l
}

module.exports.prototype = {

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event
   *
   * @example
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   */
  on: function on (event, cb) {
    return add(this.events, event, cb).rm
  },

  /**
   * Add a one-time listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event
   *
   * @example
   * const unbind = ee.once('tick', (tickType, tickDuration) => {
   *   works = true
   * })
   */
  once: function once (event, cb) {
    var l = add(this.events, event, cb)
    l.once = true
    return l.rm
  },

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @returns {boolean} `true` if the event had listeners, else `false`.
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   */
  emit: function emit (event) {
    var list = this.events[event]
    if (!list || !list.length) return false

    var rm = []
    var args = new Array(arguments.length - 1)
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i]
    }

    for (i = 0; i < list.length; i++) {
      var l = list[i]
      if (l.once) rm.push(l)
      l.fn.apply(this, args)
    }

    for (i = 0; i < rm.length; i++) rm[i].rm()

    return true
  }

}
