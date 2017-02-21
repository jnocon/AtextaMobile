
// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setUserData: ['userId', 'messages', 'groups', 'token', 'loggedIn'],
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

// we've logged out
export const logout = (state: Object) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_USER_DATA]: setUserData,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState: Object) => loginState.username !== null