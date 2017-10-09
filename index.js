'use strict'

/**
 * External dependencies
 */
const freeze = require('functional-freeze')
const forEach = require('lodash/forEach')
const isEqual = require('lodash/isEqual')
const assign = require('lodash/fp/assign')
const reduce = require('lodash/reduce')
const isPlainObject = require('lodash/isPlainObject')

const listeners = []
const effects = []

let reducers = Object.create(null)

// State always needs to be frozen, even if it is initially empty
let state = freeze(Object.create(null))

const isNotReducer = func => (typeof func !== 'function')

/**
 * Dispatches an action, triggers the side effects, reducers and listeners.
 *
 * @param Mixed action Action that needs dispatching
 */
const dispatch = action => {
  forEach(effects, effect => {
    effect(action)
  })

  // Reducers for each state[reducer], action
  const newState = freeze(reduce(reducers, (result, reducer, key) => {
    result[key] = reducer(state[key], action)
    return result
  }, {}))

  // Only update the listeners if the state is dirty
  if (!isEqual(newState, state)) {
    state = newState

    // Listeners for each
    forEach(listeners, listen => {
      listen(state)
    })
  }
}

/**
 * Sets up the initial reducers, if wanted.
 *
 * @param Function, ...Function One or more reducer functions
 */
function initializeReducers () {
  if (!isPlainObject(arguments[0])) throw Error('Needs plain object as first argument.')

  const result = reduce(arguments[0], (result, reducer, name) => {
    if (isNotReducer(reducer)) throw Error('Not a reducer function.')

    result.state[name] = reducer()
    result.reducers[name] = reducer

    return result
  }, { state: Object.create(null), reducers })

  reducers = result.reducers
  state = freeze(result.state)
}

/**
 * Subscribe to any state change with a listener function.
 *
 * @param  Function func  Listener function, receives new state as only parameter.
 * @return Void
 */
const subscribe = (func) => {
  listeners.push(func)
}

/**
 * Resets the complete state.
 */
const reset = () => {
  state = freeze(Object.create(null))
  reducers = Object.create(null)

  listeners.length = 0
  effects.length = 0
}

/**
 * Registers a side effect function.
 *
 * @param Function func Side effect function, receives dispatch action argument
 */
const sideEffect = func => {
  effects.push(func)
}

/**
 * Selects from the state.
 *
 * @param  Function func Select function, receives current state
 * @return Mixed         Whatever is returned from func
 */
const select = func => func(state)

module.exports = { subscribe, dispatch, initializeReducers, reset, sideEffect, select }
