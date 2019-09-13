import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Document from './document'
//import Input from './input'
import Login from './login'
import {w3cwebsocket as W3CWebSocket} from 'websocket'

const client = new W3CWebSocket('ws://192.168.100.211:8080')
const Application = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [userName, setUserName] = useState('username')
	const [userActivity, setUserActivity] = useState([])
	const [docContent, setDocContent] = useState('')

	let dataFromServer
	let tempName //temporary uname until sever verifies

	client.onopen = () => {
		console.log('WebSocket Client Connected to server')
	}
	client.onclose = () => {
		console.log('WebSocket server closing or offline...')
	}
	client.onmessage = (message) => {
		dataFromServer = JSON.parse(message.data)
		console.log('im RECIEVING parsed: ', dataFromServer)

		if (dataFromServer.type === 'userevent') {
			/* ON USEREVENT*/

			let index = dataFromServer.data.userActivity.length - 1
			console.log(dataFromServer.data.userActivity[index])
			let newestActivity = [
				...userActivity,
				dataFromServer.data.userActivity[index]
			]
			setUserActivity(newestActivity)
			if (tempName === dataFromServer.data.username) {
				setUserName(dataFromServer.data.username)

				setIsLoggedIn(true)
			} else {
				setIsLoggedIn(isLoggedIn)
			}
		}
		if (dataFromServer.type === 'contentchange') {
			let index = dataFromServer.data.content_length
			setDocContent(dataFromServer.data.content[index])
		}
	}

	const handleUserNameInput = (e) => {
		setUserName(e)
	}
	const onSubmit = (e) => {
		let data = userName
		tempName = userName
		client.send(
			JSON.stringify({
				username: data,
				type: 'userevent'
			})
		)
	}
	const handleUserInput = (e) => {
		setDocContent(e)
		let data = e
		client.send(
			JSON.stringify({
				username: userName,
				type: 'contentchange',
				content: data
			})
		)
	}

	return (
		<div>
			<div className="userActivity">
				activity: {userActivity[userActivity.length - 1]}{' '}
			</div>
			{isLoggedIn ? (
				<div className="wrapper">
					<Document
						docContent={docContent}
						handleUserInput={(e) => handleUserInput(e)}
					/>
				</div>
			) : (
				<Login
					onSubmit={() => onSubmit()}
					uName={userName}
					handleUserInput={(e) => handleUserNameInput(e)}
				/>
			)}
		</div>
	)
}

//Render

ReactDOM.render(<Application />, document.getElementById('root'))