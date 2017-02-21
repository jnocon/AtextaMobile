
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setGroup: ['group']
})

export const GroupDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  group: null
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message
export const setGroup = (state: Object, { group }: Object) =>
  state.merge({group})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_GROUP]: setGroup,
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
