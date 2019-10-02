const userReducer = (state = {
	name: "username",
	id: "userid",
	isLoggedIn: false
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
		case 'SET_LOGIN':
		state = {
			...state,
			isLoggedIn: action.payload
		}
	}
return state
}
export default userReducer