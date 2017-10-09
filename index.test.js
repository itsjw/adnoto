/**
 * External dependencies
 */
const test = require('ava')
const Promise = require('bluebird')

/**
 * Internal dependencies
 */
const { select, reset, subscribe, dispatch, initializeReducers, sideEffect } = require('./index')

function defer () {
  let resolve
  let reject

  const promise = new Promise(function () {
    resolve = arguments[0]
    reject = arguments[1]
  })

  return { promise, resolve, reject }
}

test('subscribe', t => {
  reset()

  const { promise, resolve } = defer()

  initializeReducers({ test: function test (state = null, action) {
    if (action === 'test') return 'super!'
  } })

  subscribe(newState => {
    t.deepEqual(newState, { test: 'super!' })
    resolve()
  })

  dispatch('test')

  return promise
})

test('initializeReducers', t => {
  reset()

  const { promise, resolve } = defer()
  const expectedState = { some: 'action-state', another: { state: 'object' } }

  subscribe(newState => {
    t.true(Object.isFrozen(newState))
    t.deepEqual(newState, expectedState)

    resolve()
  })

  // Initial reducers
  function some (state, action) {
    if (action) return 'action-state'
    return 'state'
  }

  function another (state, action) {
    return { state: 'object' }
  }

  initializeReducers({
    some,
    another
  })

  dispatch('test')

  return promise
})

test('sideEffect', t => {
  const { resolve, promise } = defer()

  sideEffect(action => {
    t.deepEqual(action, { some: 'action' })
    resolve()
  })

  dispatch({ some: 'action' })

  return promise
})

test('select', t => {
  reset()

  function some () { return { some: 'value' } }
  function another () { return { what: 'a test' } }

  initializeReducers({
    some,
    another
  })

  const state = select(function (state) {
    t.deepEqual(state, { some: { some: 'value' }, another: { what: 'a test' } })
    return state.some
  })

  t.deepEqual(state, { some: 'value' })
})
