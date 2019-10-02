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
export default userReducer