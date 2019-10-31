//document component
import React from 'react'

const Document = (props) => {
	return (
		<div className="documentWrapper">
		
			<textarea value={props.docContent}
				onChange={(e) => props.handleUserInput(e.target.value)}
					className="document" />
		</div>
	)
}

export default Document