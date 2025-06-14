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
  idDocumentUrls?: string[];
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

export interface PurchaseRequest {
  id: string;
  _id?: string;
  policyId?: string;
  userId?: string;
  vehicleId?: string;
  user?: {
    id: string;
    fullname: string;
    email?: string;
    phoneNumber?: string;
    idDocumentUrls?: string[];
  };
  policyType: string;
  submittedOn?: string;
  createdAt?: string;
  status: string | { value: string };
  duration?: number;
  coverageArea?: string;
  premium?: number;
  documents?: {
    url?: string;
    name?: string;
    type?: string;
  }[];
  vehicle?: {
    _id?: string;
    userId?: string;
    vehicleType?: string;
    privateVehicle?: {
      usageType?: string[];
      vehicleCategory?: string;
      generalDetails?: {
        make?: string;
        model?: string;
        manufacturingYear?: number;
        chassisNumber?: string;
        engineCapacity?: number;
        plateNumber?: string;
        bodyType?: string;
        engineNumber?: string;
      };
      ownershipUsage?: {
        ownerType?: string;
        purchasedValue?: number;
        dutyFree?: boolean;
        driverType?: string;
        seatingCapacity?: number;
      };
      documents?: {
        driversLicense?: string;
        vehicleLibre?: string;
      };
    };
    createdAt?: string;
    updatedAt?: string;
  };
  vehicleInformation?: {
    coverRequired?: string;
    vehicleInGoodRepair?: string;
    vehicleLeftOvernight?: string;
    soleProperty?: string;
    privateUse?: string;
    convicted?: string;
    insuredBefore?: string;
    companyHistory?: string[];
    hadAccidents?: string;
    claimsInjury?: string;
    claimsProperty?: string;
    personalAccident?: string;
    passengersInsured?: string;
  };
  driverInformation?: {
    fullName?: string;
    drivers?: Array<{
      driverName?: string;
      driverLicenseGrade?: string;
      drivingExperience?: string;
    }>;
  };
}

export interface PurchaseRequestsResponse {
  data: PurchaseRequest[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}

// Claims interface based on backend specification
export interface Claim {
  id: string;
  claimantName: string;
  dateSubmitted?: string; // Made optional since backend returns undefined
  policyNumber: string;
  status: "draft" | "submitted" | "Under Review" | "Approved" | "Rejected" | "Needs More Info" | "Forwarded" | "policeReportUnderReview" | "proformaSubmissionPending" | "proformaUnderReview";
  vehicleInfo: string;
  accidentDate?: string | Date; // Made optional and allow Date object
  location: string | object; // Allow object since backend returns [Object]
  driverName: string;
  damageImages: string[];
  declaration: boolean;
  statusHistory?: {
    status: string;
    note: string;
    date: string;
  }[];
}

export interface PaginatedClaims {
  claims: Claim[];
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// Backend response structure
interface ClaimsResponse {
  data: Claim[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Premium Settings interfaces
export interface PremiumSettings {
  baseRates: {
    comprehensive: number;
    ownDamage: number;
    thirdParty: number;
  };
  multipliers: {
    commercialVehicle: number;
    underageDriver: number;
    lessThanSixMonthsExperience: number;
    accidentHistory: number;
    claimHistory: number;
  };
  addOns: {
    personalAccident: number;
    passengerAccident: number;
    radioCoveragePercent: number;
  };
  updatedBy?: string;
  updatedAt?: string;
}

export interface PremiumSettingsResponse {
  success: boolean;
  data: PremiumSettings;
  message?: string;
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

// Purchase Requests API
export const purchaseRequestsApi = {
  // Get list of purchase requests (pending only)
  getAll: async (params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PurchaseRequestsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/admin/purchase-requests${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<PurchaseRequestsResponse>(endpoint);
  },

  // Get all purchase requests with filtering (pending, approved, rejected)
  getAllRequests: async (params: {
    status?: 'pending' | 'approved' | 'rejected';
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<PurchaseRequestsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/admin/purchase-requests/all${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<PurchaseRequestsResponse>(endpoint);
  },

  // Get specific purchase request details
  getById: async (id: string): Promise<PurchaseRequest> => {
    return apiRequest<PurchaseRequest>(`/admin/purchase-requests/${id}`);
  },

  // Approve a purchase request (if needed)
  approve: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/purchase-requests/${id}/approve`, {
      method: 'PUT',
    });
  },

  // Reject a purchase request (if needed)
  reject: async (id: string, reason: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/purchase-requests/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Request reupload for a purchase request
  requestReupload: async (id: string, files: string[], reason?: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/purchase-requests/${id}/request-reupload`, {
      method: 'POST',
      body: JSON.stringify({ files, reason }),
    });
  },

  // Calculate premium for a purchase request
  calculatePremium: async (id: string): Promise<{
    success: boolean;
    data: {
      policyId: string;
      vehicleValue: number;
      depreciatedValue: number;
      vehicleAge: number;
      coverageType: string;
      baseRate: number;
      basePremium: number;
      finalMultiplier: number;
      finalPremium: number;
      duration: number;
      breakdown: {
        carValue: number;
        carAge: number;
        riskFactor: number;
        depreciationAmount: number;
        coverageType: string;
        basePremium: number;
        finalPremium: number;
      };
      appliedMultipliers: {
        commercial: number;
        underage: string | number;
        experience: number;
        accidents: number;
        claims: number;
      };
    };
  }> => {
    return apiRequest(`/admin/purchase-requests/${id}/calculate-premium`, {
      method: 'POST',
    });
  },

  // Approve a purchase request with premium calculation
  approveWithPremium: async (id: string, approvalData: {
    calculatedPremium: number;
    premiumBreakdown: {
      carValue: number;
      carAge: number;
      riskFactor: number;
      depreciationAmount: number;
      coverageType: string;
      basePremium: number;
      finalPremium: number;
    };
    policyDuration?: number;
    effectiveDate?: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      purchaseRequest: {
        id: string;
        status: string;
        premium: number;
        updatedAt: string;
      };
      policy: {
        id: string;
        policyNumber: string;
        premium: number;
        premiumBreakdown: object;
        coverageType: string;
        effectiveDate: string;
        expiryDate: string;
        approvedBy: string;
        approvedAt: string;
        notes?: string;
      };
    };
  }> => {
    return apiRequest(`/admin/purchase-requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });
  },
};

// Claims API
export const claimsApi = {
  // Get paginated list of claims
  getClaims: async (params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedClaims> => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/admin/claims${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiRequest<ClaimsResponse>(endpoint);
      
      console.log('Raw claims API response:', response);
      
      // Map backend response structure to our expected format
      return {
        claims: response.data || [],
        pagination: {
          total: response.meta?.total || 0,
          page: response.meta?.page || 1,
          totalPages: response.meta?.totalPages || 1
        }
      };
    } catch (error) {
      console.error('Claims API error:', error);
      throw error;
    }
  },

  // Get specific claim details
  getClaimById: async (id: string): Promise<Claim> => {
    return apiRequest<Claim>(`/admin/claims/${id}`);
  },

  // Update claim status
  updateClaimStatus: async (
    id: string, 
    status: string, 
    note?: string
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/admin/claims/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },
};

// Premium Settings API
export const premiumSettingsApi = {
  // Get current premium settings
  getSettings: async (): Promise<PremiumSettingsResponse> => {
    return apiRequest<PremiumSettingsResponse>('/admin/premium-settings');
  },

  // Update premium settings
  updateSettings: async (settings: PremiumSettings): Promise<PremiumSettingsResponse> => {
    return apiRequest<PremiumSettingsResponse>('/admin/premium-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export default { userApi, adminApi, authApi, purchaseRequestsApi, claimsApi, premiumSettingsApi }; 