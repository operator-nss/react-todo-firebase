import {useEffect, useRef, useState} from 'react'
import TodoItem from "./components/TodoItem/TodoItem.jsx";
import AddTodo from "./components/AddTodo/AddTodo.jsx";
import {
	collection,
	query,
	onSnapshot,
	doc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";

import {db, storage} from "./firebase.js";
import {getDownloadURL, listAll, ref} from "firebase/storage";

function App() {
	const [todos, setTodos] = useState([])
	const [downloadUrl, setDownloadUrl] = useState([]);
	
	useEffect(() => {
			const q = query(collection(db, "todos"));
			const unsub = onSnapshot(q, (querySnapshot) => {
				let todosArray = [];
				querySnapshot.forEach((doc) => {
					todosArray.push({...doc.data(), id: doc.id});
				});
				setTodos(todosArray);
			});
		const FileListRef = ref(storage, '')
		listAll(FileListRef).then(res => {
			res.items.forEach(item => {
				getDownloadURL(item).then(url => setDownloadUrl(prev => [...prev, url]))
			})
		})
			console.log('loading')
			return () => unsub();
	}, []);
	
	
	/** Edit Todo */
	const handleEdit = async (todo, title, text) => {
		await updateDoc(doc(db, "todos", todo.id), {title, text});
	};
	/** Change Todos completed */
	const toggleComplete = async (todo) => {
		await updateDoc(doc(db, "todos", todo.id), {completed: !todo.completed});
	};
	/** Delete Todo*/
	const handleDelete = async (id) => {
		await deleteDoc(doc(db, "todos", id));
	};
	
	return (
		<div className='app'>
			<h1 className='app__title'>ToDo React + Firebase</h1>
			<AddTodo />
			<ul>
				{todos.map(todo => (
					<li key={todo.id}>
						<TodoItem
							downloadUrl={downloadUrl}
							toggleComplete={toggleComplete}
							handleDelete={handleDelete}
							handleEdit={handleEdit}
							key={todo.id}
							todo={todo}/>
					
					</li>
				))}
			</ul>
		</div>
	)
}

export default App
