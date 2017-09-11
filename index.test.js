/**
 * External dependencies
 */
const test = require('ava')
const Promise = require('bluebird')

/**
 * Internal dependencies
 */
const { select, reset, subscribe, dispatch, addReducer, initialReducers, sideEffect } = require('./index')

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

  subscribe(newState => {
    t.deepEqual(newState, {})
    resolve()
  })

  dispatch()

  return promise
})

test('addReducer', t => {
  reset()

  const { promise, resolve } = defer()

  subscribe(newState => {
    t.deepEqual(newState, { test: { hello: 'world' } })

    resolve()
  })

  t.throws(() => {
    addReducer(function () {})
  }, Error)

  addReducer(function test (currentState, action) {
    t.deepEqual(currentState, undefined)
    t.deepEqual(action, undefined)

    return { hello: 'world' }
  })

  return promise
})

test('initialReducers', t => {
  reset()

  const { promise, resolve } = defer()
  const expectedState = { some: 'state', another: { state: 'object' } }

  subscribe(newState => {
    t.true(Object.isFrozen(newState))
    t.deepEqual(newState, expectedState)

    resolve()
  })

  // Initial reducers
  function some () { return 'state' }
  function another () { return { state: 'object' } }

  t.throws(() => {
    initialReducers(
      function () {},
      some
    )
  }, Error)

  initialReducers(
    some,
    another
  )

  dispatch()

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

  initialReducers(
    some,
    another
  )

  const state = select(function (state) {
    t.deepEqual(state, { some: { some: 'value' }, another: { what: 'a test' } })
    return state.some
  })

  t.deepEqual(state, { some: 'value' })
})
