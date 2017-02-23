
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setUserData: ['userId', 'messages', 'groups', 'token', 'loggedIn'],
  updateMessageArr: ['messages'],
  updateGroupArr: ['groups'],
  logout: null
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  userId: null,
  messages: [],
  groups: [],
  token: null,
  loggedIn: false
})

/* ------------- Reducers ------------- */

//  we've successfully logged in
export const setUserData = (state: Object, { userId, messages, groups, token, loggedIn }: Object) =>
  state.merge({userId, messages, groups, token, loggedIn})

export const updateMessageArr = (state: Object, { messages }: Object) =>
  state.merge({messages})

export const updateGroupArr = (state: Object, { groups }: Object) =>
  state.merge({groups})

// we've logged out
export const logout = (state: Object) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_USER_DATA]: setUserData,
  [Types.UPDATE_MESSAGE_ARR]: updateMessageArr,
  [Types.UPDATE_GROUP_ARR]: updateGroupArr,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState: Object) => loginState.username !== null