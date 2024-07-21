import React, { useState, useEffect } from 'react';

const Cards = () => {
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('To Do');

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      fetchTasks(user_id);
    }
  }, []);

  const fetchTasks = async (user_id) => {
    try {
      const response = await fetch(`http://localhost:57251/api/Tasks/${user_id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(task => task.task_id === taskId);
    if (taskToEdit) {
      setEditMode(taskId);
      setEditedTitle(taskToEdit.title);
      setEditedDescription(taskToEdit.description);
      setEditedStatus(taskToEdit.status);
    }
  };

  const handleSave = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:57251/api/Tasks/Update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          status: editedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTasks = tasks.map(task => {
        if (task.task_id === taskId) {
          return {
            ...task,
            title: editedTitle,
            description: editedDescription,
            status: editedStatus,
          };
        }
        return task;
      });
      setTasks(updatedTasks);
      setEditMode(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:57251/api/Tasks/Delete/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      const updatedTasks = tasks.filter(task => task.task_id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:57251/api/Tasks/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          due_date: newTaskDueDate,
          status: newTaskStatus,
          user_id: localStorage.getItem('user_id'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      fetchTasks(localStorage.getItem('user_id'));

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setNewTaskStatus('To Do');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Filter tasks based on status and search term
  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'All' && task.status !== statusFilter) {
      return false;
    }
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ 
      margin: '0 auto', 
      maxWidth: '1200px', 
      padding: '1rem' 
    }}>
      {/* Filter and search controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description"
            style={{ 
              border: '1px solid #ccc', 
              padding: '0.5rem', 
              width: '100%',
              fontSize: '0.875rem',
              outline: 'none',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <label style={{ marginRight: '1rem', fontSize: '0.875rem' }}>Filter by Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              border: 'none', 
              fontSize: '0.875rem', 
              outline: 'none'
            }}
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Form for creating new task */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder="Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
          style={{ 
            marginRight: '0.5rem', 
            padding: '0.5rem', 
            fontSize: '0.875rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            width: '200px'
          }}
        />
        <input 
          type="text" 
          placeholder="Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          required
          style={{ 
            marginRight: '0.5rem', 
            padding: '0.5rem', 
            fontSize: '0.875rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            width: '300px'
          }}
        />
        <input 
          type="date" 
          placeholder="Due Date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          style={{ 
            marginRight: '0.5rem', 
            padding: '0.5rem', 
            fontSize: '0.875rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            width: '150px'
          }}
        />
        <select 
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value)}
          style={{ 
            marginRight: '0.5rem', 
            padding: '0.5rem', 
            fontSize: '0.875rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            width: '150px'
          }}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button 
          type="submit"
          style={{ 
            backgroundColor: '#007bff', 
            color: '#fff', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            border: 'none', 
            cursor: 'pointer' 
          }}>Create Task</button>
      </form>

      {/* Display filtered tasks */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1rem' 
      }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.task_id} style={{ 
              backgroundColor: '#fff', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <div style={{ padding: '1.5rem', flexGrow: 1 }}>
                {editMode === task.task_id ? (
                  <>
                    <input 
                      type="text" 
                      value={editedTitle} 
                      onChange={(e) => setEditedTitle(e.target.value)}
                      style={{ 
                        border: 'none', 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.5rem',
                        width: '100%',
                        outline: 'none'
                      }}
                    />
                    <textarea 
                      value={editedDescription} 
                      onChange={(e) => setEditedDescription(e.target.value)}
                      style={{ 
                        border: 'none', 
                        fontSize: '1rem', 
                        color: '#666', 
                        marginBottom: '1rem',
                        width: '100%',
                        resize: 'vertical',
                        outline: 'none'
                      }}
                    />
                    <select 
                      value={editedStatus} 
                      onChange={(e) => setEditedStatus(e.target.value)}
                      style={{ 
                        marginLeft: '0.5rem',
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </>
                ) : (
                  <>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem' 
                    }}>{task.title}</h2>
                    <p style={{ 
                      fontSize: '1rem', 
                      color: '#666', 
                      marginBottom: '1rem' 
                    }}>{task.description}</p>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#888', 
                      marginBottom: '0.5rem' 
                    }}>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#888', 
                      marginBottom: '1rem' 
                    }}>Status: {task.status}</p>
                  </>
                )}
              </div>
              <div style={{ 
                backgroundColor: '#f0f0f0', 
                padding: '1rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderTop: '1px solid #ddd' 
              }}>
                <button 
                  onClick={() => handleDelete(task.task_id)}
                  style={{ 
                    backgroundColor: '#dc3545', 
                    color: '#fff', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '4px', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}>Delete</button>
                {editMode === task.task_id ? (
                  <>
                    <button 
                      onClick={() => handleSave(task.task_id)}
                      style={{ 
                        backgroundColor: '#28a745', 
                        color: '#fff', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer',
                        marginLeft: '0.5rem'
                      }}
                    >Save</button>
                    <button 
                      onClick={handleCancel}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: '#fff', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer'
                      }}
                    >Cancel</button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleEdit(task.task_id)}
                    style={{ 
                      backgroundColor: '#007bff', 
                      color: '#fff', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}>Edit</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Cards;
