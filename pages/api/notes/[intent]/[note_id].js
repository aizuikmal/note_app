const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')

require('dotenv').config()

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESSKEY,
	secretAccessKey: process.env.AWS_SECRET
})

const s3 = new AWS.S3()

const note_get_by_id = async (note_id) => {

	var params = {
		Bucket: 'aizu-notes',
		Key : `contents/${note_id}.txt`
	}
	console.log('note_get_by_id() params: ',params)
	
	return new Promise((resolve,reject) => {

		try {
			s3.getObject(params, function(err, data){

				if(err) console.log('note_get_by_id() ERROR ',err)
		
				if(data !== null){
					let content = data.Body.toString()
					// console.log('note_get_by_id() CONTENT ',content)
					resolve(content)
				}else{
					resolve('')
				}
		
			})
		} catch (error) {
			reject(error)
		}


	})

}

const note_get_all = async () => {

	var params = {
		Bucket: 'aizu-notes',
		Key : `contents.json`
	}
	
	return new Promise((resolve,reject) => {

		s3.getObject(params, function(err, data){
			if (err){ console.error(err) }
	
			let index_list = JSON.parse(data.Body.toString())
	
			// console.log('note_get_all() ',data.Body.toString())
			// console.log('note_get_all() JSON ',index_list)
			
			resolve(index_list)
	
		})

	})


}

const note_post = async ({note_id, content = '', title = ''}) => {

	return new Promise((resolve,reject) => {

		var datetime = moment().format('YYYYMMDD');

		let note_id_act
		if(note_id === 'new'){
			note_id_act = datetime + '-' + uuidv4()
		}else{
			note_id_act = note_id
		}

		// let title
		// const content_lines = content.split("\n")
		// const firstline = content_lines[0]
		// if(firstline.length > 30){
		// 	title = firstline.substr(0,30)
		// }else{
		// 	title = firstline
		// }

		var filePath = `contents/${note_id_act}.txt`
		var params = {
			Bucket: 'aizu-notes',
			// Body : fs.createReadStream(filePath),
			Body : content,
			Key : filePath
		}
		s3.upload(params, function (err, data) {
			if (err) {
				console.log("Error", err);
				reject(err)
			}

			if (data) {
				console.log("Uploaded in:", data.Location)
				note_update_index(note_id_act,title)
				resolve({ id:note_id_act, title })
			}
		})


	})


}

const note_delete = async ({note_id}) => {

	return new Promise((resolve,reject) => {

		var filePath = `contents/${note_id}.txt`
		var params = {
			Bucket: 'aizu-notes',
			Key : filePath
		}
		s3.deleteObject(params, function (err, data) {
			if (err) {
				console.log("Error", err);
				reject(err)
			}

			if (data) {
				console.log("Uploaded in:", data.Location)
				note_update_index_delete(note_id)
				resolve({})
			}
		})


	})


}


const note_update_index_delete = async (note_id_act) => {

	var params = {
		Bucket: 'aizu-notes',
		Key : `contents.json`
	}

	s3.getObject(params, function(err, data){
		if (err){ console.error(err) }
		
		// console.log('index_list original: ',data.Body.toString())

		let index_list = JSON.parse(data.Body.toString())
		delete index_list[note_id_act]

		// console.log('index_list (json): ',index_list)
		// console.log('index_list (stringify): ',JSON.stringify(index_list))


		const upload_params = {
			Bucket: 'aizu-notes',
			Body : JSON.stringify(index_list),
			Key : `contents.json`
		}
		s3.upload(upload_params, function (err, data) {
			if (err) { console.log("Error", err) }
			console.log("Uploaded index:", data.Location)
			console.log('index updated')
		})


	})
	

}

const note_update_index = async (note_id_act,title) => {

	var params = {
		Bucket: 'aizu-notes',
		Key : `contents.json`
	}

	s3.getObject(params, function(err, data){
		if (err){ console.error(err) }
		
		// console.log('index_list original: ',data.Body.toString())

		let index_list = JSON.parse(data.Body.toString())
		index_list[note_id_act] = { title }

		// console.log('index_list (json): ',index_list)
		// console.log('index_list (stringify): ',JSON.stringify(index_list))


		const upload_params = {
			Bucket: 'aizu-notes',
			Body : JSON.stringify(index_list),
			Key : `contents.json`
		}
		s3.upload(upload_params, function (err, data) {
			if (err) { console.log("Error", err) }
			console.log("Uploaded index:", data.Location)
			console.log('index updated')
		})


	})
	

}

const note_process = async (req, res) => {
	
	const { intent, note_id } = req.query;

	if(intent == 'get'){
		if(note_id != 'all'){
			let pl = await note_get_by_id(note_id)
			res.send(pl)
		}else{
			let pl = await note_get_all(note_id)
			res.send(pl)
		}
	}else if(intent == 'delete'){
		if (req.method === 'POST') {
			let pl = await note_delete({ note_id })
			res.send(pl)
		}else{
			res.send('error')
		}
	}else if(intent == 'post'){
		if (req.method === 'POST') {
			const { content, title } = req.body
			let pl = await note_post({ note_id, content, title })
			res.send(pl)
		}else{
			res.send('error')
		}
	}   

}

export default note_process












