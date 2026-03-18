import { useState, useEffect, useCallback } from 'react';
import * as apiClient from '../lib/api-client';
import type {
  Lead,
  Project,
  Booking,
  Agent,
  Approval,
  Activity,
  Analytics,
  User,
  AuthResponse,
} from '../lib/api-client';

// ============================================================================
// TYPES
// ============================================================================

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseMutationResult<T> {
  mutate: (data: unknown) => Promise<T>;
  loading: boolean;
  error: Error | null;
}

// ============================================================================
// QUERY HOOKS - LEADS
// ============================================================================

export const useLeads = (status?: string): UseQueryResult<Lead[]> => {
  const [data, setData] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchLeads(status);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useLead = (id: string): UseQueryResult<Lead> => {
  const [data, setData] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchLead(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useCreateLead = (): UseMutationResult<Lead> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Lead> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.createLead(data as Partial<Lead>);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useUpdateLead = (): UseMutationResult<Lead> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Lead> => {
    setLoading(true);
    setError(null);
    try {
      const { id, ...updateData } = data as { id: string } & Partial<Lead>;
      const result = await apiClient.updateLead(id, updateData);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useDeleteLead = (): UseMutationResult<void> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { id } = data as { id: string };
      await apiClient.deleteLead(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// ============================================================================
// QUERY HOOKS - PROJECTS
// ============================================================================

export const useProjects = (status?: string): UseQueryResult<Project[]> => {
  const [data, setData] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchProjects(status);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useProject = (id: string): UseQueryResult<Project> => {
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchProject(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useCreateProject = (): UseMutationResult<Project> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Project> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.createProject(data as Partial<Project>);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useUpdateProject = (): UseMutationResult<Project> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Project> => {
    setLoading(true);
    setError(null);
    try {
      const { id, ...updateData } = data as { id: string } & Partial<Project>;
      const result = await apiClient.updateProject(id, updateData);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// ============================================================================
// QUERY HOOKS - BOOKINGS
// ============================================================================

export const useBookings = (status?: string): UseQueryResult<Booking[]> => {
  const [data, setData] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchBookings(status);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useBooking = (id: string): UseQueryResult<Booking> => {
  const [data, setData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchBooking(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useCreateBooking = (): UseMutationResult<Booking> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Booking> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.createBooking(data as Partial<Booking>);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useUpdateBooking = (): UseMutationResult<Booking> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Booking> => {
    setLoading(true);
    setError(null);
    try {
      const { id, ...updateData } = data as { id: string } & Partial<Booking>;
      const result = await apiClient.updateBooking(id, updateData);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// ============================================================================
// QUERY HOOKS - AGENTS
// ============================================================================

export const useAgents = (): UseQueryResult<Agent[]> => {
  const [data, setData] = useState<Agent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchAgents();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useAgent = (id: string): UseQueryResult<Agent> => {
  const [data, setData] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchAgent(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useUpdateAgent = (): UseMutationResult<Agent> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Agent> => {
    setLoading(true);
    setError(null);
    try {
      const { id, ...updateData } = data as { id: string } & Partial<Agent>;
      const result = await apiClient.updateAgent(id, updateData);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useExecuteAgentAction = (): UseMutationResult<unknown> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const { id, action, payload } = data as { id: string; action: string; payload: unknown };
      const result = await apiClient.executeAgentAction(id, action, payload);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// ============================================================================
// QUERY HOOKS - APPROVALS
// ============================================================================

export const useApprovals = (status?: string): UseQueryResult<Approval[]> => {
  const [data, setData] = useState<Approval[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchApprovals(status);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useApproveItem = (): UseMutationResult<Approval> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Approval> => {
    setLoading(true);
    setError(null);
    try {
      const { id } = data as { id: string };
      const result = await apiClient.approveItem(id);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useRejectItem = (): UseMutationResult<Approval> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Approval> => {
    setLoading(true);
    setError(null);
    try {
      const { id, reason } = data as { id: string; reason: string };
      const result = await apiClient.rejectItem(id, reason);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useRequestRevision = (): UseMutationResult<Approval> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Approval> => {
    setLoading(true);
    setError(null);
    try {
      const { id, notes } = data as { id: string; notes: string };
      const result = await apiClient.requestRevision(id, notes);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// ============================================================================
// QUERY HOOKS - ACTIVITIES
// ============================================================================

export const useActivities = (limit?: number): UseQueryResult<Activity[]> => {
  const [data, setData] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchActivities(limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useCreateActivity = (): UseMutationResult<Activity> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<Activity> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.createActivity(data as Partial<Activity>);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

// ============================================================================
// QUERY HOOKS - ANALYTICS
// ============================================================================

export const useAnalytics = (): UseQueryResult<Analytics> => {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchAnalytics();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// ============================================================================
// MUTATION HOOKS - AUTH
// ============================================================================

export const useLogin = (): UseMutationResult<AuthResponse> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const { email, password } = data as { email: string; password: string };
      const result = await apiClient.login(email, password);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useSignup = (): UseMutationResult<AuthResponse> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: unknown): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const { email, password, name } = data as { email: string; password: string; name: string };
      const result = await apiClient.signup(email, password, name);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};

export const useGetCurrentUser = (): UseMutationResult<User> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data?: unknown): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const token = (data as { token?: string } | undefined)?.token;
      const result = await apiClient.getCurrentUser(token);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};
