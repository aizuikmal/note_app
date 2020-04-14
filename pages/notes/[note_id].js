import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Router from 'next/router'
import ReactHtmlParser from 'react-html-parser'
import Link from 'next/link'
import Head from 'next/head'
import axios from 'axios'

import NoteList from '../../components/notes/NoteList'

const Notes = ({query : query_initial_prop}) => {

	const router = useRouter()

	const { note_id } = query_initial_prop
	
	const [noteId, SET_noteId] = useState(note_id)
	const [hideSidebar, SET_hideSidebar] = useState(true)
	const [content, SET_content] = useState(false)
	const [title, SET_title] = useState(false)
	
	const cellRef = useRef(null)

	const delete_note = async () => {

		if (confirm('Are you sure to delete this note ?')){
		
			const a = await axios.post(`/api/notes/delete/${noteId}`,{})
			const b = a.data
			console.log('delete_note() axios :',b)

			setTimeout(() => {
				Router.push('/notes/new')
			},500)

		}

	}

	const save_note = async () => {

		console.log('save_note() cellRef',cellRef)

		let content_ref_html
		let content_ref_text
		if(cellRef.current.innerHTML !== null && cellRef.current.innerText !== null){
			content_ref_html = cellRef.current.innerHTML
			content_ref_text = cellRef.current.innerText
		}else{
			if(cellRef.current.innerHTML === null){
				content_ref_html = cellRef.current.innerText
				content_ref_text = cellRef.current.innerText
			}
			if(cellRef.current.innerText === null){
				content_ref_html = cellRef.current.innerHTML
				content_ref_text = cellRef.current.innerHTML
			}
		}

		const content_lines = content_ref_text.split("\n")
		const firstline = content_lines[0]
		let title_set
		if(firstline.length > 30){
			title_set = firstline.substr(0,30)
		}else{
			title_set = firstline
		}
		SET_title(title_set)
		console.log('save_note() id : ',noteId)

		const uri = `/api/notes/post/${noteId}`
		const a = await axios.post(uri,{ content:content_ref_html, title:title_set})
		const b = a.data
		console.log('save_note() axios uri :',uri)
		console.log('save_note() axios :',b)

		SET_noteId(b.id)

		history.pushState({}, "page 2", `/notes/${b.id}`);

	}

	const init = async () => {

		console.log('init() noteId:',noteId)

		if(noteId === 'new'){
			SET_content(true)
			setTimeout(() => {
				cellRef.current.focus()	
			},10)
		}else{
			SET_content(false)
			const a = await axios.get(`/api/notes/get/${noteId}`)
			const note_content = a.data
			SET_content(ReactHtmlParser(note_content))
		}
	}

	const open_by_id = async (id) => {

		console.log('open_by_id() noteId:',id)
		
		if(id === 'new'){
			SET_content(true)
		}else{
			SET_content(false)
			const a = await axios.get(`/api/notes/get/${id}`)
			const note_content = a.data
			SET_content(ReactHtmlParser(note_content))
		}
	}

	const captureKeyStroke = (e) => {
		if(e.keyCode === 83 && e.metaKey){
			console.log('document',document)
			console.log('addEventListener() noteId:',noteId)
			save_note()
			e.preventDefault()
		}
	}

	useEffect(() => {
		init()
	},[])

	useEffect(() => {
		window.addEventListener('keydown', captureKeyStroke )
		return (() => {
			window.removeEventListener('keydown', captureKeyStroke )
		})
	},[noteId])

	useEffect(() => {
		console.log('query_initial_prop',query_initial_prop)
		console.log('router.query.note_id',router.query.note_id)
		SET_noteId(router.query.note_id)
		open_by_id(router.query.note_id)
	},[router.query.note_id])

	return (
		<>
		<Head>
			<title>Notes</title>
			<link rel="stylesheet" href="/styles.css" />
		</Head>
		<div className="container">
			<div className={`sidebar ${ hideSidebar && `hide` }`}>
				<a className="unhide" onClick={() => { hideSidebar ? SET_hideSidebar(false) :  SET_hideSidebar(true) }}><div className="middot">&nbsp;</div></a>
				<div className="brand">aizu<span>notes</span></div>
				<div className="new_note"><Link href="/notes/new"><a>+</a></Link></div>
				<NoteList />
			</div>
			<div className="main">
				
				<div className={`write ${ content ? '' : 'not_load' }`} ref={cellRef} contentEditable="true" suppressContentEditableWarning="true">{content}</div>
				{ !content && <div className="content_loading">Loading...</div> }
				<div className="control">
					<div className="left">
						<div className="tips"><div className="current_note_id">{noteId}</div></div>
					</div>
					<div className="right">
						{noteId !== 'new' && <button className="delete" onClick={() => { delete_note() }}>Delete</button> }
						<button className="save" onClick={() => { save_note(noteId) }}>Save</button>
					</div>
				</div>
			</div>
		</div>
		</>
	)

}

Notes.getInitialProps = async ({ req, query, res }) => {
	return { query }
}

export default Notes