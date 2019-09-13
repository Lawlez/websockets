import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Document from './document'
import Input from './input'
import Login from './login'
import {w3cwebsocket as W3CWebSocket} from 'websocket'

const client = new W3CWebSocket('ws://192.168.100.211:8080')
const Application = () => {
	
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [userName, setUserName] = useState('username')
	let dataFromServer

	client.onopen = () => {
		console.log('WebSocket Client Connected to server')
	}
	client.onclose = () => {
		console.log('WebSocket server closing or offline...')
	}
	client.onmessage = (message) => {
		console.log(message)
		dataFromServer = JSON.parse(message.data)
		console.log('im RECIEVING parsed: ', dataFromServer)

		if (dataFromServer.type === 'userevent') {

		}
	}

const handleUserInput = (e) => {
	setUserName(e)
}
const onSubmit = (e) => {
	let data = userName
	
	client.send(JSON.stringify({
			username: data,
			type: "userevent"}))
	setIsLoggedIn(true)
}

	return (
		<div>
			{isLoggedIn ? (
				<div className="wrapper">
					<Input /> <Document />
				</div>
			) : (
				<Login onSubmit={ () => onSubmit() } uName={userName} handleUserInput={(e) => handleUserInput(e)}/>
			)}
		</div>
	)
}

//Render

ReactDOM.render(<Application />, document.getElementById('root'))