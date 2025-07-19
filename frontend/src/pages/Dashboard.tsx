import React, { useState, useEffect, useContext, type JSX } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import '../css/DashBoard.css';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

const Dashboard = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Task[]>('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to fetch tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title.');
      return;
    }
    
    try {
      await axios.post('/api/tasks', {
        title: newTaskTitle,
        description: newTaskDescription
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      toast.success('Task created successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to create task.');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id: string, completed: boolean) => {
    try {
      await axios.put(`/api/tasks/${id}`, { completed });
      toast.success('Task updated successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/tasks/${id}`);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task.');
      console.error(err);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.username || 'Guest'}!</h2>
      <h3>Manage your tasks efficiently</h3>
      
      <div className="task-form">
        <h4>Create New Task</h4>
        <form onSubmit={handleCreateTask}>
          <div className="task-form-row">
            <input
              type="text"
              placeholder="Task title (required)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <button type="submit">
              Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="tasks-header">
        <h3>Your Tasks</h3>
        <div className="tasks-stats">
          <span>Total: {totalTasks}</span>
          <span>Completed: {completedTasks}</span>
          <span>Remaining: {totalTasks - completedTasks}</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h4>No tasks yet!</h4>
          <p>Create your first task above to get started with organizing your work.</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
              </div>
              <div className="task-actions">
                <button 
                  className={task.completed ? 'incomplete-btn' : 'complete-btn'}
                  onClick={() => handleUpdateTask(task._id, !task.completed)}
                >
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
