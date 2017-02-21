
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setMessage: ['message']
})

export const MessageDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  message: null
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message
export const setMessage = (state: Object, { message }: Object) =>
  state.merge({message})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_MESSAGE]: setMessage,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
