import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import config from '../config';

dayjs.extend(relativeTime);

function Todo() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [todoId, setTodoId] = useState('');
  const [errors, setErrors] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [open, setOpen] = useState(false);
  const [uiLoading, setUiLoading] = useState(true);
  const [buttonType, setButtonType] = useState('');
  const [viewOpen, setViewOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'body') {
      setBody(value);
    }
  };

  useEffect(() => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get(`${config.api.baseURL}${config.api.endpoints.todos}`)
      .then(response => {
        setTodos(response.data);
        setUiLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, [navigate]);

  const deleteTodoHandler = (data) => {
    authMiddleWare(navigate);
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let todoId = data.todo.todoId;
    axios
      .delete(`${config.api.baseURL}${config.api.endpoints.todo}/${todoId}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.todoId !== todoId));
        setSnackbar({ open: true, message: 'Todo deleted successfully!', severity: 'success' });
      })
      .catch(err => {
        setErrors([err.message || 'Failed to delete todo']);
        setSnackbar({ open: true, message: err.message || 'Failed to delete todo', severity: 'error' });
        console.log(err);
      });
  };

  const handleEditClickOpen = (data) => {
    setTitle(data.todo.title);
    setBody(data.todo.body);
    setTodoId(data.todo.todoId);
    setButtonType('Edit');
    setOpen(true);
  };

  const handleViewOpen = (data) => {
    setTitle(data.todo.title);
    setBody(data.todo.body);
    setViewOpen(true);
  };

  const handleClickOpen = () => {
    setTodoId('');
    setTitle('');
    setBody('');
    setButtonType('');
    setOpen(true);
  };

  const handleSubmit = (event) => {
    authMiddleWare(navigate);
    event.preventDefault();
    const userTodo = {
      title: title,
      body: body,
    };
    let options = {};
    if (buttonType === 'Edit') {
      options = {
        url: `${config.api.baseURL}${config.api.endpoints.todo}/${todoId}`,
        method: 'put',
        data: userTodo,
      };
    } else {
      options = {
        url: `${config.api.baseURL}${config.api.endpoints.todo}`,
        method: 'post',
        data: userTodo,
      };
    }
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios(options)
      .then(response => {
        setOpen(false);
        if (buttonType === 'Edit') {
          setTodos(prevTodos => prevTodos.map(todo =>
            todo.todoId === todoId ? { ...todo, ...userTodo } : todo
          ));
          setSnackbar({ open: true, message: 'Todo updated successfully!', severity: 'success' });
        } else {
          setTodos(prevTodos => [...prevTodos, response.data]);
          setSnackbar({ open: true, message: 'Todo added successfully!', severity: 'success' });
        }
        setTitle('');
        setBody('');
        setTodoId('');
        setErrors([]);
      })
      .catch(error => {
        setOpen(true);
        setErrors([error.response?.data?.message || 'Failed to submit todo']);
        setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to submit todo', severity: 'error' });
        console.log(error);
      });
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (uiLoading === true) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <MuiAlert severity="info" sx={{ width: '100%' }}>Loading todos...</MuiAlert>
      </div>
    );
  // Snackbar close handler
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  // ...existing code...
  {/* Snackbar for notifications */}
  <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
    <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
      {snackbar.message}
    </MuiAlert>
  </Snackbar>
  } else {
    return (
      <div>
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={handleClickOpen}
            style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            +
          </button>
        </div>

        {/* Add/Edit Todo Modal */}
        {open && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0 }}>
                  {buttonType === 'Edit' ? 'Edit Todo' : 'Create a new Todo'}
                </h2>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: 'bold' 
                  }}>
                    Todo Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.title && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                      {errors.title}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: 'bold' 
                  }}>
                    Todo Details
                  </label>
                  <textarea
                    name="body"
                    value={body}
                    onChange={handleChange}
                    required
                    rows={10}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                  {errors.body && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                      {errors.body}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#3f51b5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {buttonType === 'Edit' ? 'Save' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Todo Modal */}
        {viewOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0 }}>{title}</h2>
                <button
                  onClick={handleViewClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ 
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '100px',
                whiteSpace: 'pre-wrap'
              }}>
                {body}
              </div>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px',
          padding: '20px 0'
        }}>
          {todos.map(todo => (
            <div key={todo.todoId} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {todo.title}
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                margin: '0 0 10px 0' 
              }}>
                {dayjs(todo.createdAt).fromNow()}
              </p>
              <p style={{ 
                color: '#555', 
                margin: '0 0 15px 0',
                lineHeight: '1.4'
              }}>
                {todo.body.length > 100 ? `${todo.body.substring(0, 100)}...` : todo.body}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleViewOpen({ todo })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => handleEditClickOpen({ todo })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodoHandler({ todo })}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Todo;