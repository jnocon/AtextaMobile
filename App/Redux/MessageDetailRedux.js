
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setMessage: ['message'],
  update: ['update']
})

export const MessageDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  message: null,
  update: false
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message
export const setMessage = (state: Object, { message }: Object) =>
  state.merge({message})

  export const update = (state: Object, {update}: Object) =>
  state.merge({update})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_MESSAGE]: setMessage,
  [Types.UPDATE]: update
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
