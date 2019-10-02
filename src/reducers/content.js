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
export default contentReducer