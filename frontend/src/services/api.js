const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Helper for API requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Add auth token if available
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData) => 
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getProfile: () => 
    request('/auth/profile', { method: 'GET' }),

  logout: () => 
    request('/auth/logout', { method: 'POST' }),

  refreshToken: (refreshToken) => 
    request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    })
};

// Tasks API
export const tasksAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getById: (id) => 
    request(`/tasks/${id}`, { method: 'GET' }),

  create: (taskData) => 
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }),

  update: (id, taskData) => 
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    }),

  delete: (id) => 
    request(`/tasks/${id}`, { method: 'DELETE' }),

  getStats: () => 
    request('/tasks/stats', { method: 'GET' })
};
