// API Service utility for handling backend requests
const API_BASE_URL = "http://localhost:3001";

// Helper function to redirect to login
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Store current page for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    // Redirect to login
    window.location.href = '/login';
  }
};

// Types based on your backend responses
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  policyCount: number;
  joined?: string;
  status?: "Active" | "Blocked" | "Suspended";
}

export interface UserDetails {
  id: string;
  fullname: string;
  phoneNumber: string;
  email: string;
  roles: string[];
  isPhoneVerified: boolean;
  title: string;
  tinNumber: string;
  country: string;
  regionOrState: string;
  city: string;
  subcity: string;
  zone: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
  profileImageUrl: string;
  walletAddress: string;
  accountCreatedAt: string;
  lastActive: string;
  notes: string;
  status?: "Active" | "Blocked" | "Suspended";
  policies: {
    id: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
  }[];
  claims: {
    id: string;
    type: string;
    status: string;
    submittedAt: string;
  }[];
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
  reference: string;
}

export interface PaginatedUsers {
  users: User[];
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  summary?: {
    totalTransactions: number;
    totalAmount: number;
    lastTransaction: string;
  };
}

export interface AdminProfile {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  language?: string;
  timezone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminProfile;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle authentication/authorization errors
    if (response.status === 401 || response.status === 403) {
      console.warn('Authentication failed or access denied. Redirecting to login...');
      redirectToLogin();
      throw new Error('Authentication required. Please log in again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.message || `Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // If it's a network error or other issues, also check if it might be auth-related
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error occurred. Please check your connection.');
    }
    
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// User Management API
export const userApi = {
  // Get paginated list of users
  getUsers: async (params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedUsers> => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<PaginatedUsers>(endpoint);
  },

  // Get detailed user information
  getUserDetails: async (id: string): Promise<UserDetails> => {
    return apiRequest<UserDetails>(`/admin/users/${id}`);
  },

  // Get user transactions
  getUserTransactions: async (
    id: string,
    params: {
      search?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedTransactions> => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/admin/users/${id}/transactions${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<PaginatedTransactions>(endpoint);
  },

  // Suspend user
  suspendUser: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${id}/suspend`, {
      method: 'PUT',
    });
  },

  // Activate user
  activateUser: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${id}/activate`, {
      method: 'PUT',
    });
  },

  // Update user status
  updateUserStatus: async (id: string, status: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Assign roles to user
  assignRoles: async (id: string, roles: string[]): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/users/${id}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roles }),
    });
  },
};

// Admin Profile API
export const adminApi = {
  // Update admin profile
  updateProfile: async (profileData: {
    fullname: string;
    email: string;
    phoneNumber: string;
    password?: string;
    language: string;
    timezone: string;
  }): Promise<AdminProfile> => {
    return apiRequest<AdminProfile>('/admin/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Delete admin account
  deleteProfile: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/admin/users/profile', {
      method: 'DELETE',
    });
  },
};

// Authentication API
export const authApi = {
  // Admin login
  login: async (credentials: {
    identifier: string;
    password: string;
  }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

export default { userApi, adminApi, authApi }; 