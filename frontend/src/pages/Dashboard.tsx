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
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Overview</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{totalTasks - completedTasks}</span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Welcome back, {user?.username || 'Guest'}!</h2>
          <p>Manage your tasks efficiently and stay productive</p>
        </div>

        <div className="task-form">
          <h4>Create New Task</h4>
          <form onSubmit={handleCreateTask}>
            <div className="task-form-grid">
              <div className="form-field">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Add a description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              <button type="submit">
                Add Task
              </button>
            </div>
          </form>
        </div>

        <div className="tasks-section">
          <h3>Your Tasks</h3>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
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
      </div>
    </div>
  );
};

export default Dashboard;
