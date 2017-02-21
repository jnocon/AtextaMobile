// @flow

import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    temperature: require('./TemperatureRedux').reducer,
    login: require('./AuthRedux').reducer,
    search: require('./SearchRedux').reducer,
    message: require('./MessageDetailRedux').reducer,
    group: require('./GroupDetailRedux').reducer,
    recipient: require('./RecipDetailRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
