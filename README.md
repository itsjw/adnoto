# adnoto
Ultra-light library to implement observer state management. i.e. lightweight replacement for when [you might not need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) but still want to have an observer pattern implementation.


## Install

Either `yarn add adnoto` or `npm install adnoto --save`.

## Usage

```javascript
  // Add the library
  const adnoto = require('./index')

  // Define some unique constants
  const ADD_USER = Symbol('ADD_USER')
  const REMOVE_USER = Symbol('REMOVE_USER')

  // Define a reducer, the name of the function is the name of the state
  function user (state = Object.create(null), action = {}) {
    switch (action.type) {
        // When no type is set (i.e. initialization) return the default state
      default: return state

      case ADD_USER: return Object.assign(Object.create(null), action.data)
      case REMOVE_USER: return Object.create(null)
    }
  }

  // Create actions
  const actionAddUser = data => adnoto.dispatch({ type: ADD_USER, data })
  const actionRemoveUser = () => adnoto.dispatch({ type: REMOVE_USER })

  // Add the initial reducer(s)
  adnoto.initialReducers(user /*, ...more reducers */)

  // Subscribe a listener function that will be notified on state change
  adnoto.subscribe(state => {
    console.log('New state', state)
  })

  // Trigger an action
  actionAddUser({ username: 'someuser', password: 'much secret' })
  actionRemoveUser()
```

### subscribe(function)

Adds a listener function to receive state changes.

### initializeReducers(function, ...function)

Initializes reducers. Each named function will be added to the state.

### dispatch(object)

Dispatches an action request to change the state. It's recommended to use an object with a `type` property that defines the action. 

### addReducer(function)

Adds a reducer to the state, needs to be a named function.

### sideEffect(function)

Adds a listener function that receives the dispatch action instead of the state results. Very handy if you want to do, well, side effects (e.g. async operations etcetera).

### reset()

Removes _all_ reducers, state and listeners.

## The reducer function

In order to function correctly, reducer functions need a specific layout. First of all, reducer functions need to be named functions, as the name of the function is the key in the state.

For example a `function testReducer () {}` will be identified in the state object as `{ testReducer: /* state */ }`. 

Each reducer with the **same name**, will overwrite the previous reducer, there is no error handling here, as it's assumed this is the wished course of action.

Secondly, reducers need to return a new state object, in all cases when triggered. If the state is the same as the previous state, then that's fine, as long as they return a value.

Thirdly the arguments to the reducer function are as follows: `state`, `action`. Where `state` is the current state and `action` is the argument parsed into the `dispatch` function.

## Contributors 

- Joseph Callaars <joseph@callaa.rs>


## License

MIT


<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/AEMubo6XgXjBRq7V3urxNFC3/bcallaars/adnoto'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/AEMubo6XgXjBRq7V3urxNFC3/bcallaars/adnoto.svg' /></a>
