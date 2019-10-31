//websocket as class
import http from 'http'
import Websocket from 'websocket'
import {reqTypes} from '../config' //importing constants
import gameTime, {
	getUniqueID,
	sendGameMove,
	handleAttacks,
	attackTypes,
	userRegisterHandler,
	applyMoves,
} from './srvHelpers'
import {newChatHandler} from './chatHandler'
import sudokuHandler, {getBoard, endGame, currentBoard} from './sudokuHandler'
export class WebSocket {
	constructor(props) {
		this.clients = []
		this.initialBoard = this.getInitialBoard()
		this.playersReady = Number(0)
		this.port = 8080
		this.server = http.createServer()
		this.webSocketServer = require('websocket').server
		this.wsServer = new this.webSocketServer({httpServer: this.server})
		this.wsServer.on('request', this.handleConnection.bind(this))
	}

	start() {
		this.server.listen(this.port)
	}
	stop() {
		this.server.close()
	}
	async getInitialBoard() {
		return await getBoard('easy') //starting board
	}
	addClient(connection, userID) {
		this.clients.push({
			userid: userID,
			connection: connection,
		})
		console.log(`connected: ${userID}from  ${connection.remoteAddress}`)
	}
	removeClient(id) {
		let clients = {
			...this.clients,
		}
		let clientIndex = clients.findIndex((client) => client.userid === id)
		delete clients[clientIndex]
		this.clients = clients
	}

	handleConnection(request) {
		const connection = request.accept(null, request.origin)
		let userID = getUniqueID()
		this.addClient(connection, userID)
		connection.on('message', (message) => {
			if (message.type !== 'utf8') {
				return
			}
			this.handleRequest(message, userID)
		})
	}
	sendMessage(data, filter = {}) {
		let clients = this.getClients(filter)
		data = JSON.stringify(data)
		for (let i = 0; i < clients.length; i++) {
			clients[i].connection.sendUTF(data)
		}
		console.log(`MESSAGE WE SENT TO CLIENT: ${filter} ${JSON.parse(data)}`)
	}
	handleRequest(message, userID) {
		let request = JSON.parse(message.utf8Data)
		console.log('request', request)
		let json = {type: request.type}
		switch (request.type) {
			case reqTypes.USER_EVENT:
				let output = userRegisterHandler(
					request,
					this.clients,
					userID,
					this.playersReady,
					json,
				)
				json.data = output && output.json ? output.json : '' ///solve this if empty
				this.sendMessage(json)
				break
			case reqTypes.CONTENT_CHANGE:
				break
			case reqTypes.RESET:
				this.resetBoard(request.username)
				break
		}
	}
	getClients(filter = {}) {
		let clients = this.clients.filter((client) => {
			let keys = Object.keys(filter)
			for (let i = 0; i < keys.length; ) {
				if (client[keys[i]] !== filter[keys[i]]) {
					return false
				}
				i++
			}
			return true
		})
		return clients
	}
	getClientByType(type, filter) {
		return this.clients.find((client) => client[type] === filter)
	}
	getClientIndex(userid) {
		return this.clients.findIndex((client) => client.userid === userid)
	}
	setClients(userid, key, content) {
		let client = this.getClientByType('userid', userid)
		client[key] = content

		let index = this.getClientIndex(userid)
		if (index === -1) {
			index = 0
		}
		this.clients[index] = client
	}

	incrementPlayers() {
		this.playersReady++
		let json = {
			type: 'info',
			players: this.playersReady,
			board: this.initialBoard,
		}
		this.sendMessage(json)
	}

	resetBoard(username) {
		let currUser = this.getClientByType('username', username)
		this.setClients(currUser.userid, 'moves', {})
		currUser = this.getClientByType('username', username)
		this.sendMessage({
			type: 'gamemove',
			data: {player: currUser.player, gameField: currUser.moves},
		})
	}
}

export default WebSocket