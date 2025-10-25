const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token from localStorage
const removeToken = () => localStorage.removeItem('token');

// API client with authentication
const apiClient = {
  // Auth endpoints
  register: async (email, password, name) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    if (data.token) setToken(data.token);
    return data;
  },

  getMe: async () => {
    const token = getToken();
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  logout: () => {
    removeToken();
  },

  // File endpoints
  uploadFile: async (file) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getFiles: async () => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/files`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  updateFileTag: async (id, tagTitle, tagColor) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/files/${id}/tag`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tagTitle, tagColor })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  deleteFile: async (id) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}/files/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

export default apiClient;