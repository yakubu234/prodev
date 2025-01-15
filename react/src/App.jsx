import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'

const App = () => {
  const [todos, setTodos] =useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  // fetc todos from laravel api 
  useEffect(() =>{
    fetchTodos();
  },[]);

  const fetchTodos = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8001/api/todo/all');
      setTodos(response.data.data)
    }catch(error){
      console.log('Error fetching todos', error);
    }
  };

  const addTodo = async () => {
    try{
      const response = await axios.post('http://127.0.0.1:8001/api/todo/add',{text: newTodo});
      setTodos([...todos, response.data.data]);
      setNewTodo();
    }catch(error){
      console.log(error);
    }
  };

  const markCompleted = async (id) => {
    try{
      await axios.put('http://127.0.0.1:8001/api/todo/update')
    }catch(error){
      console.log(error);
    }
  }

  const editTodo = (id,text) => {
    setEditingTodo(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    try{
      const response = await axios.put('http://127.0.0.1:8001/api/todo/update/'.id, {text:editText});
      setTodos(todos.map((todo) => (todo.id === id? response.data.data: todo)));
      setEditingTodo(null);
      setEditText('');
    }catch(error){
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  }

  return(
    <div className='App' >
      <h1>Todo List</h1>
      <div>
        <div>
          <input type="text" value={newTodo} onChange={(e) =>setNewTodo(e.target.value)} placeholder="Entr New  Todo title" />
        </div>
        <div>
          <input type="text" value={newTodo} onChange={(e) =>setNewTodo(e.target.value)} placeholder="Entr New  Todo Description " />
        </div>
        <button onClick={addTodo}>Add New Todo</button>
      </div>
      <ul>
  {todos.map((todo) => (
    <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {editingTodo === todo.id ? (
        <div>
          <div>
            <input 
              type="text" 
              value={newTodo} 
              onChange={(e) => setEditTodo(e.target.value)} 
              placeholder="Enter New Todo Title" 
            />
          </div>
          <div>
            <input 
              type="text" 
              value={newTodo} 
              onChange={(e) => setEditTodo(e.target.value)} 
              placeholder="Enter New Todo Description" 
            />
          </div>
          <button onClick={() => saveEdit(todo.id)}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      ) : (
        <>
          {todo.text}
          {!todo.completed && (
            <button onClick={() => markCompleted(todo.id)}>Complete</button>
          )}
          <button onClick={() => editTodo(todo.id, todo.text)}>Edit</button>
        </>
      )}
    </li>
  ))}
</ul>

   </div>

   
  );

  
}

  
export default App
