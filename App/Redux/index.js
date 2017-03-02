// @flow

import { combineReducers } from 'redux'
import configureStore from './CreateStore'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    login: require('./AuthRedux').reducer,
    message: require('./MessageDetailRedux').reducer,
    group: require('./GroupDetailRedux').reducer,
    recipient: require('./RecipDetailRedux').reducer,
    recipArr: require('./RecipArrRedux').reducer,
    secret: require('./SecretDetailRedux').reducer
  })

  return configureStore(rootReducer)
}
