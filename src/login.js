//login component
import React from 'react'

const Login = (props) => {

	return(
		<div className="loginWrapper">
			<div className="loginInner">
			<input type="text" value={props.uName} onChange={(e) => props.handleUserInput(e.target.value)}/>
			
			<button onClick={props.onSubmit}> Submit </button>
			
			</div>
		</div>
		)
}
export default Login