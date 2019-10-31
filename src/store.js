
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import userReducer from './reducers/user'
import contentReducer from './reducers/content'

export default createStore(
	combineReducers({userReducer, contentReducer}),
	{},
	applyMiddleware(logger))
