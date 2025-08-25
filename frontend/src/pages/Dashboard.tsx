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
  priority?: 'low' | 'medium' | 'high'; // New: Task priority
  dueDate?: string; // New: Task due date
}

const Dashboard = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium'); // New state for priority
  const [newTaskDueDate, setNewTaskDueDate] = useState(''); // New state for due date
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState<'low' | 'medium' | 'high'>('medium'); // New state for edited priority
  const [editedDueDate, setEditedDueDate] = useState(''); // New state for edited due date
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

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
        description: newTaskDescription,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium'); // Reset to default
      setNewTaskDueDate(''); // Reset
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
      toast.success('Task status updated successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task status.');
      console.error(err);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setEditedPriority(task.priority || 'medium'); // Set for editing
    setEditedDueDate(task.dueDate || ''); // Set for editing
  };

  const handleSaveEdit = async (id: string) => {
    if (!editedTitle.trim()) {
      toast.error('Task title cannot be empty.');
      return;
    }

    try {
      await axios.put(`/api/tasks/${id}`, {
        title: editedTitle.trim(),
        description: editedDescription.trim(),
        priority: editedPriority,
        dueDate: editedDueDate,
      });
      toast.success('Task updated successfully!');
      setEditingTaskId(null);
      setEditedTitle('');
      setEditedDescription('');
      setEditedPriority('medium'); // Reset
      setEditedDueDate(''); // Reset
      fetchTasks();
    } catch (err) {
      toast.error('Failed to save task changes.');
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedPriority('medium'); // Reset
    setEditedDueDate(''); // Reset
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

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.priority && task.priority.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.dueDate && task.dueDate.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <span className="stat-label">Pending</span>
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
              <div className="form-field task-title-field">
                <label>Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-field description-field">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Add a description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              {/* New row for Priority and Due Date */}
              <div className="form-field priority-field">
                <label>Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-field due-date-field">
                <label>Due Date (Optional)</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="due-date-input"
                />
              </div>
              {/* Button moved to align with new grid area */}
              <button type="submit" className="add-task-button">
                Add Task
              </button>
            </div>
          </form>
        </div>

        <div className="tasks-section">
          <h3>Your Tasks</h3>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h4>No tasks yet or no matches found!</h4>
              <p>Create your first task above or try a different search query.</p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    {editingTaskId === task._id ? (
                      <div className="edit-task-form">
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="edit-task-title-input"
                        />
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="edit-task-description-input"
                        />
                        <select
                          value={editedPriority}
                          onChange={(e) => setEditedPriority(e.target.value as 'low' | 'medium' | 'high')}
                          className="edit-task-priority-select"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <input
                          type="date"
                          value={editedDueDate}
                          onChange={(e) => setEditedDueDate(e.target.value)}
                          className="edit-task-due-date-input"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="task-title-priority">
                          <div className="task-title">{task.title}</div>
                          {task.priority && <span className={`task-priority priority-${task.priority}`}>{task.priority}</span>}
                        </div>
                        {task.description && (
                          <div className="task-description">{task.description}</div>
                        )}
                        {task.dueDate && <div className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
                      </>
                    )}
                  </div>
                  <div className="task-actions">
                    {editingTaskId === task._id ? (
                      <>
                        <button className="save-btn" onClick={() => handleSaveEdit(task._id)}>
                          Save
                        </button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={task.completed ? 'incomplete-btn' : 'complete-btn'}
                          onClick={() => handleUpdateTask(task._id, !task.completed)}
                        >
                          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                        </button>
                        <button className="edit-btn" onClick={() => handleEditClick(task)}>
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
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
