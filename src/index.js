
import { Provider } from "react-redux";
import React from 'react'
import ReactDOM from 'react-dom'
import Application from './containers/app'
import {w3cwebsocket as W3CWebSocket} from 'websocket'
import store from './store'
export const client = new W3CWebSocket('ws://192.168.100.211:8080')


//Render

ReactDOM.render(
	<Provider store={store}><Application /></Provider>, 
	document.getElementById('root'))