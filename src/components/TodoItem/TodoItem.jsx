import {useEffect, useRef, useState} from "react";
import './todo-item.scss'
import {
	MdOutlineSubtitles,
	MdDoneOutline,
	MdOutlineModeEditOutline,
	MdOutlineDelete,
	MdChecklistRtl,
	MdTextsms
} from 'react-icons/md'
import clsx from "clsx";
import {getDate} from "../../helpers/getDate.js";
import dayjs from "dayjs";
import {listAll, getDownloadURL, ref} from "firebase/storage";
import {storage} from "../../firebase.js";

const TodoItem = ({todo, toggleComplete, handleDelete, handleEdit, downloadUrl}) => {
	const [newTitle, setNewTitle] = useState(todo?.title);
	const [newText, setNewText] = useState(todo?.text);
	
	const [edit, setEdit] = useState(false);
	
	const [editedTitle, setEditedTitle] = useState(false);
	const [editedText, setEditedText] = useState(false);

	/** Change Title with Input */
	const handleChangeTitle = (e) => {
		e.preventDefault();
		setEditedTitle(true)
		if (todo.completed === true) {
			setNewTitle(todo.title);
		} else {
			todo.title = "";
			setNewTitle(e.target.value);
		}
	};
	/** Change Text with Input */
	const handleChangeText = (e) => {
		e.preventDefault();
		setEditedText(true)
		if (todo.completed === true) {
			setNewText(todo.text);
		} else {
			todo.text = "";
			setNewText(e.target.value);
		}
	};
	/** Toggle Edit mode */
	const editMode = () => {
		setEdit(!edit);
		handleEdit(todo, newTitle, newText)
	}
	
	useEffect(() => {
		if (!todo.completed) {
			let time = dayjs()
			let timeUnix = dayjs(time).unix()
			if (todo.date.seconds - timeUnix < 0) {
				toggleComplete(todo)
			}
		}
	}, [])
	
	
	return (
		<div className="todo">
			<div className='todo__label'>
				<div className={clsx('todo__title', {active: todo.completed})}>
					<MdOutlineSubtitles/>
					{edit ? <input
						type="text"
						value={editedTitle ? newTitle : todo?.title}
						className="todo__title-input"
						onChange={handleChangeTitle}
					/> : editedTitle ? newTitle : todo?.title}
				</div>
				
				<div className={clsx('todo__text', {active: todo.completed})}>
					<MdTextsms/>
					{edit ? <input
						type="text"
						value={editedText ? newText : todo?.text}
						className="todo__title-input"
						onChange={handleChangeText}
					/> : editedText ? newText : todo?.text}
				</div>
				<div className={clsx('todo__date', {active: todo.completed})}>{getDate(todo.date.seconds)}</div>
			
			</div>
			
			{downloadUrl?.find(url => url.includes(todo.fileName)) &&
				<a href={downloadUrl.find(url => url.includes(todo.fileName))} target='_blank' className='todo__download'>Download
					file</a>
			}
			<button
				className={clsx("todo__complete", {active: todo.completed})}
				onClick={() => toggleComplete(todo)}
			>
				{todo.completed ? <MdChecklistRtl/> : <MdDoneOutline/>}
			
			</button>
			<button
				disabled={todo.completed}
				className="todo__edit"
				onClick={editMode}
			>
				<MdOutlineModeEditOutline/>
			</button>
			<button className="todo__delete" onClick={() => handleDelete(todo.id)}>
				<MdOutlineDelete/>
			</button>
		</div>
	);
};

export default TodoItem;