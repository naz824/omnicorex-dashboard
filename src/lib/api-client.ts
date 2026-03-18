// API Client for Vercel serverless functions
// Handles all HTTP requests to /api/* endpoints

const getBaseUrl = (): string => {
  // Client-side only
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  // Production - use same origin
  return '';
};

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

const createApiError = (message: string, status?: number, data?: unknown): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.data = data;
  return error;
};

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const apiFetch = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = typeof data === 'object' && data !== null && 'message' in data
      ? (data as { message: string }).message
      : `API Error: ${response.statusText}`;
    throw createApiError(errorMessage, response.status, data);
  }

  return data as T;
};

// ============================================================================
// LEADS
// ============================================================================

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchLeads = async (status?: string): Promise<Lead[]> => {
  const query = status ? `?status=${status}` : '';
  return apiFetch<Lead[]>(`/leads${query}`);
};

export const fetchLead = async (id: string): Promise<Lead> => {
  return apiFetch<Lead>(`/leads/${id}`);
};

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  return apiFetch<Lead>('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
  return apiFetch<Lead>(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteLead = async (id: string): Promise<void> => {
  await apiFetch(`/leads/${id}`, {
    method: 'DELETE',
  });
};

// ============================================================================
// PROJECTS
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'on-hold';
  leadId: string;
  startDate: string;
  endDate?: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
}

export const fetchProjects = async (status?: string): Promise<Project[]> => {
  const query = status ? `?status=${status}` : '';
  return apiFetch<Project[]>(`/projects${query}`);
};

export const fetchProject = async (id: string): Promise<Project> => {
  return apiFetch<Project>(`/projects/${id}`);
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// ============================================================================
// BOOKINGS
// ============================================================================

export interface Booking {
  id: string;
  projectId: string;
  agentId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchBookings = async (status?: string): Promise<Booking[]> => {
  const query = status ? `?status=${status}` : '';
  return apiFetch<Booking[]>(`/bookings${query}`);
};

export const fetchBooking = async (id: string): Promise<Booking> => {
  return apiFetch<Booking>(`/bookings/${id}`);
};

export const createBooking = async (data: Partial<Booking>): Promise<Booking> => {
  return apiFetch<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateBooking = async (id: string, data: Partial<Booking>): Promise<Booking> => {
  return apiFetch<Booking>(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// ============================================================================
// AGENTS
// ============================================================================

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  specialties: string[];
  createdAt: string;
  updatedAt: string;
}

export const fetchAgents = async (): Promise<Agent[]> => {
  return apiFetch<Agent[]>('/agents');
};

export const fetchAgent = async (id: string): Promise<Agent> => {
  return apiFetch<Agent>(`/agents/${id}`);
};

export const updateAgent = async (id: string, data: Partial<Agent>): Promise<Agent> => {
  return apiFetch<Agent>(`/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const executeAgentAction = async (
  id: string,
  action: string,
  payload: unknown
): Promise<unknown> => {
  return apiFetch(`/agents/${id}/action`, {
    method: 'POST',
    body: JSON.stringify({ action, payload }),
  });
};

// ============================================================================
// APPROVALS
// ============================================================================

export interface Approval {
  id: string;
  itemId: string;
  itemType: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision-requested';
  requestedBy: string;
  reviewedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchApprovals = async (status?: string): Promise<Approval[]> => {
  const query = status ? `?status=${status}` : '';
  return apiFetch<Approval[]>(`/approvals${query}`);
};

export const approveItem = async (id: string): Promise<Approval> => {
  return apiFetch<Approval>(`/approvals/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

export const rejectItem = async (id: string, reason: string): Promise<Approval> => {
  return apiFetch<Approval>(`/approvals/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

export const requestRevision = async (id: string, notes: string): Promise<Approval> => {
  return apiFetch<Approval>(`/approvals/${id}/revision`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
};

// ============================================================================
// ACTIVITIES
// ============================================================================

export interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  relatedId?: string;
  relatedType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const fetchActivities = async (limit?: number): Promise<Activity[]> => {
  const query = limit ? `?limit=${limit}` : '';
  return apiFetch<Activity[]>(`/activities${query}`);
};

export const createActivity = async (data: Partial<Activity>): Promise<Activity> => {
  return apiFetch<Activity>('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ============================================================================
// ANALYTICS
// ============================================================================

export interface Analytics {
  totalLeads: number;
  totalProjects: number;
  activeBookings: number;
  revenueThisMonth: number;
  conversionRate: number;
  averageProjectValue: number;
}

export const fetchAnalytics = async (): Promise<Analytics> => {
  return apiFetch<Analytics>('/analytics');
};

// ============================================================================
// AUTH
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
};

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
};

export const getCurrentUser = async (token?: string): Promise<User> => {
  const authToken = token || getAuthToken();
  if (!authToken) {
    throw createApiError('No authentication token found');
  }
  return apiFetch<User>('/auth/me', {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

export { getAuthToken, setAuthToken };
