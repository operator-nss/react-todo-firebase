import React, {useRef, useState} from 'react';
import './add-todo.scss'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import {AiOutlinePlus} from 'react-icons/ai'
import {BiCommentAdd} from 'react-icons/bi'
import {ImUpload2} from 'react-icons/im'
import {db} from "../../firebase.js";
import {collection, addDoc,} from "firebase/firestore";
import clsx from "clsx";
import {ref, uploadBytes} from 'firebase/storage'
import {storage} from "../../firebase.js";
import {v4} from 'uuid'


const AddTodo = () => {
	
	const [title, setTitle] = React.useState('');
	const [text, setText] = React.useState('');
	const [date, setDate] = React.useState('');
	const [file, setFile] = React.useState('');
	
	/** Add Todo ib DB Firebase */
	const addTask = async (e) => {
		e.preventDefault();
		
		if (title !== "" || text !== "" || date !== "") {
			let fileName;
			if (file) {
				fileName = `${file.name + v4()}`
				const fileRef = ref(storage, fileName)
				await uploadBytes(fileRef, file).then(() => {
					console.log('upload complete')
				})
			}
			await addDoc(collection(db, "todos"), {
				title,
				text,
				date,
				fileName: fileName ? fileName : '',
				completed: false,
			});
			setTitle("");
			setText("");
			setDate("");
			setFile("");
			window.location.reload();
		}
	};
	
	
	return (
		<div className='add-todo'>
			<form onSubmit={addTask} id='form' className='add-todo__form' action="#">
				<div className='add-todo__item'>
					<input
						type="text"
						onKeyPress={e => e.key === 'Enter' && addTask()}
						onChange={e => {
							setTitle(e.target.value)
						}}
						className={`outline-none block w-full bg-transparent placeholder-gray-900 text-2xl text-gray-800`}
						placeholder='Add title'
					/>
				</div>
				<div className='add-todo__item'>
					<input
						type="text"
						onKeyPress={e => e.key === 'Enter' && addTask()}
						onChange={e => {
							setText(e.target.value)
						}}
						className={`outline-none block w-full bg-transparent placeholder-gray-900 text-2xl text-gray-800`}
						placeholder='Add todo-text'
					/>
				</div>
				<div className='add-todo__item'>
					<DatePicker
						selected={date}
						onChange={(data) => setDate(data)}
						dateFormat='dd.MM.yyyy'
						placeholderText='Set Date'
					/>
				</div>
				
				<div className={clsx('add-todo__item add-todo__item--file', {active: file})}>
					{file ? <div onClick={() => setFile('')} className='delete-file'>
						<ImUpload2/>
						File added</div> : <>
						<label htmlFor="input-file">
							<AiOutlinePlus/>
							Add file</label>
						<input id='input-file'
						       onChange={(data) => setFile(data.target.files[0])}
						       type="file"/>
					</>}
				
				</div>
				<button className='add-todo__button' type='submit'>
					<BiCommentAdd/>
					Add ToDo
				</button>
			</form>
		</div>
	);
};

export default AddTodo;