import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';

function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING'
  });

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingTask) {
        await tasksAPI.update(editingTask.id, formData);
        setSuccess('Task updated successfully');
      } else {
        await tasksAPI.create(formData);
        setSuccess('Task created successfully');
      }
      setShowForm(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'MEDIUM', status: 'PENDING' });
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setError('');
    setSuccess('');

    try {
      await tasksAPI.delete(id);
      setSuccess('Task deleted successfully');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'MEDIUM', status: 'PENDING' });
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-pending',
      IN_PROGRESS: 'badge-progress',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-cancelled'
    };
    return badges[status] || 'badge-pending';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      LOW: 'badge-low',
      MEDIUM: 'badge-medium',
      HIGH: 'badge-high'
    };
    return badges[priority] || 'badge-medium';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="dashboard-brand">Prime Trade Tasks</div>
          <div className="dashboard-user">
            <span>
              {user.firstName} {user.lastName} ({user.role})
            </span>
            <button onClick={logout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="container">
          {(error || success) && (
            <div style={{ marginBottom: '20px' }}>
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
            </div>
          )}

          <div className="task-list">
            <div className="task-header">
              <h2>My Tasks</h2>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary btn-sm"
              >
                + New Task
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="task-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Task title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Task description"
                    rows="3"
                  />
                </div>

                {editingTask && (
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary">
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks yet</h3>
                <p>Create your first task to get started</p>
              </div>
            ) : (
              <div className="task-grid">
                {tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-card-header">
                      <h3>{task.title}</h3>
                    </div>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`badge ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-actions">
                      <button
                        onClick={() => handleEdit(task)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: 'white', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>API Documentation</h3>
            <p style={{ fontSize: '13px', color: '#888' }}>
              View the full API documentation at{' '}
              <a href="http://localhost:5000/api-docs" target="_blank" rel="noopener noreferrer">
                http://localhost:5000/api-docs
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
