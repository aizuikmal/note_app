import Router from 'next/router'
import React, { useEffect } from "react";

const Notes = ({ children }) => {

	useEffect(() => {
		const {pathname} = Router
		Router.push('/notes/new')
	},[]);

	return (
		<>
		Redirect...
		</>
	)

}

export default Notes