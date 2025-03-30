import { useAuth } from '@/context/AuthContext';

// Base URL for our API
const API_URL = 'http://localhost:5000/api';

// Helper function to detect if we're in frontend-only mode
export const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}`);
    return response.ok;
  } catch (error) {
    console.log('Backend not available, using mock data');
    return false;
  }
};

// Generic fetcher function
const fetcher = async (url: string, options: RequestInit = {}) => {
  // Try to connect to the backend, if it fails, return null
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      return fetcher(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    },
    register: async (userData: any) => {
      return fetcher(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    },
    getProfile: async (token: string) => {
      return fetcher(`${API_URL}/users/profile`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    },
    updateProfile: async (token: string, userData: any) => {
      return fetcher(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
    }
  },
  
  // Event endpoints
  events: {
    getAll: async (filters = {}) => {
      // Convert filters to query params
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
      
      return fetcher(`${API_URL}/events?${params.toString()}`);
    },
    getById: async (id: string) => {
      return fetcher(`${API_URL}/events/${id}`);
    },
    create: async (token: string, eventData: any) => {
      return fetcher(`${API_URL}/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
    },
    update: async (token: string, id: string, eventData: any) => {
      return fetcher(`${API_URL}/events/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
    },
    delete: async (token: string, id: string) => {
      return fetcher(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
    },
    register: async (token: string, id: string) => {
      return fetcher(`${API_URL}/events/${id}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
  }
};

// Custom hook to get API with authentication
export const useApi = () => {
  const { token } = useAuth();
  
  // Return API with token included in auth methods
  return {
    // We keep the original API methods
    ...api,
    
    // But we add some convenience methods that automatically use the token
    getProfile: () => api.auth.getProfile(token as string),
    updateProfile: (userData: any) => api.auth.updateProfile(token as string, userData),
    createEvent: (eventData: any) => api.events.create(token as string, eventData),
    updateEvent: (id: string, eventData: any) => api.events.update(token as string, id, eventData),
    deleteEvent: (id: string) => api.events.delete(token as string, id),
    registerForEvent: (id: string) => api.events.register(token as string, id)
  };
};
