
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setGroup: ['group'],
  setNewRecipArr: ['newRecipArr'],
  setAddRecipArr: ['addRecipArr']
})

export const GroupDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  group: null,
  newRecipArr: [],
  addRecipArr: []
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message
export const setGroup = (state: Object, { group }: Object) =>
  state.merge({group})

export const setNewRecipArr = (state: Object, { newRecipArr }: Object) =>
  state.merge({newRecipArr})

export const setAddRecipArr = (state: Object, { addRecipArr }: Object) =>
  state.merge({addRecipArr})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_GROUP]: setGroup,
  [Types.SET_NEW_RECIP_ARR]: setNewRecipArr,
  [Types.SET_ADD_RECIP_ARR]: setAddRecipArr
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
