import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

const NoteList = () => {

	const [noteList, SET_noteList] = useState(false)

	const init = async () => {

		const a = await axios.get('/api/notes/get/all')
		SET_noteList(a.data)
		// console.log('NoteList() a.data',a.data)

	}

	useEffect(() => {

		init()

	},[])

	return (

		<ul>
			{
				noteList ? Object.keys(noteList).map((key, i) => {
					return (
					<li key={key}><Link href={`/notes/[note_id]`} as={`/notes/${key}`}><a>{ noteList[key].title ? noteList[key].title : 'no_title'}</a></Link></li>
					)
				})
				:
				'Loading...'
			}
			
		</ul>

	)

}

export default NoteList