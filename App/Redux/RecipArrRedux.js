
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setGroup: ['group'],
  setNewRecipArr: ['newRecipArr'],
  setAddRecipArr: ['addRecipArr']
})

export const RecipArrTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  newRecipArr: [],
  addRecipArr: []
})

/* ------------- Reducers ------------- */

//  we've successfully clicked a message

export const setNewRecipArr = (state: Object, { newRecipArr }: Object) =>
  state.merge({newRecipArr})

export const setAddRecipArr = (state: Object, { addRecipArr }: Object) =>
  state.merge({addRecipArr})


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_NEW_RECIP_ARR]: setNewRecipArr,
  [Types.SET_ADD_RECIP_ARR]: setAddRecipArr
})
