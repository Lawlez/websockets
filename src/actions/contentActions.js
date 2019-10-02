export setContent(content) => {
	return {
		type: 'SET_CONTENT',
		payload: content
	}
}
export setUserActivity(activity) => {
	return {
		type: 'SET_ACTIVITY',
		payload: activity
	}
}