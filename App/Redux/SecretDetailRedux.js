import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setMessage: ['message'],
  setChoices: ['messageChoices']
})

export const SecretDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  message: undefined,
  messageChoices: []
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message
export const setMessage = (state: Object, { message }: Object) =>
  state.merge({message})

export const setChoices = (state: Object, { messageChoices }: Object) =>
  state.merge({messageChoices})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_MESSAGE]: setMessage,
  [Types.SET_CHOICES]: setChoices
})

/* ------------- Selectors ------------- */

// Is the current user logged in?