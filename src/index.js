
import { Provider } from "react-redux";
import {createStore, combineReducers, applyMiddleware} from 'redux'
import logger from 'redux-logger'
//import Input from './input'
import React from 'react'
import ReactDOM from 'react-dom'
import Application from './app'
import {w3cwebsocket as W3CWebSocket} from 'websocket'

export const client = new W3CWebSocket('ws://192.168.100.211:8080')

const userReducer = (state = {
	name: "username",
	id: "userid"
}, action) => {
	switch (action.type) {
		case "SET_NAME":
		state = {
			...state,
			name: action.payload
		}
		break
		case "SET_ID":
		state = {
			...state,
			id: action.payload
		}
		break
	}
return state
}
const contentReducer = (state = {
	content: "Yout Text Goes Here, With Redux!"
}, action) => {
	switch (action.type) {
		case "SET_CONTENT":
		state = {
			...state,
			content: action.payload
		}
		break
	}
return state
}


const store = createStore(
	combineReducers({userReducer, contentReducer}),
	{},
	applyMiddleware(logger))
//Render

ReactDOM.render(
	<Provider store={store}><Application /></Provider>, 
	document.getElementById('root'))