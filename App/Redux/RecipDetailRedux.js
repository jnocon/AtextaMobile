
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setRecipient: ['recipient']
})

export const RecipDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  recipient: null
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message
export const setRecipient = (state: Object, { recipient }: Object) =>
  state.merge({recipient})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_RECIPIENT]: setRecipient,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
