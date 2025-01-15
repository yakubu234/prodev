import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch todos from Laravel API
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/todo/`);
      setTodos(response.data.data);
      toast.success('Todos fetched successfully!');
    } catch (error) {
      toast.error('Error fetching todos');
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTitle || !newDescription) {
      toast.warn('Please fill in both title and description.');
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}/todo/add`, {
        title: newTitle,
        description: newDescription,
      });
      setTodos([...todos, response.data.data]);
      setNewTitle('');
      setNewDescription('');
      toast.success('Todo added successfully!');
    } catch (error) {
      toast.error('Error adding todo');
      console.error('Error adding todo:', error);
    }
  };

  const markCompleted = async (id) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/todo/completed/${id}`, {
        status: 'completed',
      });
      setTodos(todos.map((todo) => (todo.id === id ? response.data.data : todo)));
      toast.success('Todo marked as completed!');
    } catch (error) {
      toast.error('Error marking todo as completed');
      console.error('Error marking todo as completed:', error);
    }
  };

  const editTodo = (id, title, description) => {
    setEditingTodo(id);
    setEditTitle(title);
    setEditDescription(description);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/todo/update/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      setTodos(todos.map((todo) => (todo.id === id ? response.data.data : todo)));
      setEditingTodo(null);
      setEditTitle('');
      setEditDescription('');
      toast.success('Todo updated successfully!');
    } catch (error) {
      toast.error('Error updating todo');
      console.error('Error updating todo:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>Todo List</h1>

      <div>
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter Todo Title"
            style={{ width: '80%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter Todo Description"
            style={{ width: '80%', height: '100px', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <button onClick={addTodo} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Add New Todo
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {editingTodo === todo.id ? (
              <div>
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Edit Todo Title"
                    style={{ width: '80%', padding: '10px', fontSize: '16px' }}
                  />
                </div>
                <div>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Edit Todo Description"
                    style={{ width: '80%', height: '100px', padding: '10px', fontSize: '16px' }}
                  />
                </div>
                <button onClick={() => saveEdit(todo.id)} style={{ padding: '10px 20px', fontSize: '16px' }}>
                  Save
                </button>
                <button onClick={cancelEdit} style={{ padding: '10px 20px', fontSize: '16px' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{todo.title}</strong> - {todo.description}
                </div>
                {!todo.completed && (
                  <button
                    onClick={() => markCompleted(todo.id)}
                    style={{ padding: '10px 20px', fontSize: '16px' }}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() => editTodo(todo.id, todo.title, todo.description)}
                  style={{ padding: '10px 20px', fontSize: '16px' }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
