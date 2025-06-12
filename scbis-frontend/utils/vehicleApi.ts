// Vehicle API utilities using fetch
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app';
// const API_BASE_URL = 'http://localhost:3001';
// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    console.log('🔍 Checking for auth token...');
    
    // First try to get token from Zustand store in localStorage
    const userStore = localStorage.getItem('SCBIS-user-storage');
    console.log('📦 localStorage SCBIS-user-storage:', userStore ? 'Found' : 'Not found');
    
    if (userStore) {
      try {
        const parsed = JSON.parse(userStore);
        console.log('📋 Parsed user store structure:', {
          hasState: !!parsed.state,
          hasUser: !!parsed.state?.user,
          hasAccessToken: !!parsed.state?.user?.accessToken,
          userKeys: parsed.state?.user ? Object.keys(parsed.state.user) : []
        });
        
        const token = parsed.state?.user?.accessToken;
        if (token) {
          console.log('🔑 Found auth token in localStorage');
          return token;
        }
      } catch (error) {
        console.error('❌ Error parsing user store:', error);
      }
    }
    
    // Fallback to cookies
    const cookies = document.cookie.split(';');
    console.log('🍪 Available cookies:', cookies.map(c => c.trim().split('=')[0]));
    
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    if (authCookie) {
      const token = authCookie.split('=')[1];
      console.log('🔑 Found auth token in cookies');
      return token;
    }
    
    console.log('❌ No auth token found in localStorage or cookies');
  }
  return null;
};

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  console.log(`🚀 API Request: ${options.method || 'GET'} ${endpoint}`);
  console.log('📤 Request config:', config);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
};

// Vehicle data types
interface VehicleFormData {
  selectedType: string;
  carType: string;
  usageType: string;
  vehicleData: {
    make: string;
    model: string;
    engineCapacity: string;
    plateNo: string;
    bodyType: string;
    engineNo: string;
    mfgYear?: string;
    chassisNo?: string;
  };
  ownershipData: {
    ownerType: string;
    purchasedValue: string;
    dutyFree: string;
    driverType: string;
    seatingCapacity: string;
  };
  documents?: {
    driversLicense?: string;
    vehicleLibre?: string;
  };
  // Add commercial categories for commercial vehicles
  commercialCategories1?: Record<string, boolean>;
  commercialCategories2?: Record<string, boolean>;
}

interface VehiclePersistenceResult {
  success: boolean;
  data: Record<string, unknown>;
  message: string;
  isUpdate: boolean;
}

// Vehicle persistence service
export const vehiclePersistenceService = {
  // Save or update vehicle based on selection state
  async saveVehicleData(vehicleFormData: Record<string, unknown>, isExistingVehicle: boolean, existingVehicleId?: string): Promise<VehiclePersistenceResult> {
    console.log('💾 Starting vehicle persistence...');
    console.log('📋 Persistence context:', {
      isExistingVehicle,
      existingVehicleId,
      vehicleFormData
    });

    try {
      if (isExistingVehicle && existingVehicleId) {
        console.log('🔄 Updating existing vehicle...');
        return await this.updateExistingVehicle(existingVehicleId, vehicleFormData);
      } else {
        console.log('🆕 Creating new vehicle...');
        return await this.createNewVehicle(vehicleFormData);
      }
    } catch (error) {
      console.error('❌ Vehicle persistence failed:', error);
      throw error;
    }
  },

  // Update existing vehicle
  async updateExistingVehicle(vehicleId: string, vehicleFormData: Record<string, unknown>): Promise<VehiclePersistenceResult> {
    console.log(`🔄 Updating vehicle ID: ${vehicleId}`);
    console.log('📤 Update payload:', vehicleFormData);

    try {
      const updatedVehicle = await apiRequest(`/policy/vehicle-details/${vehicleId}`, {
        method: 'PUT',
        body: JSON.stringify(vehicleFormData),
      });
      
      console.log('✅ Vehicle updated successfully:', updatedVehicle);
      return {
        success: true,
        data: updatedVehicle,
        message: 'Vehicle updated successfully',
        isUpdate: true
      };
    } catch (error) {
      console.error(`❌ Failed to update vehicle ID ${vehicleId}:`, error);
      throw new Error(`Failed to update vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Create new vehicle
  async createNewVehicle(vehicleFormData: Record<string, unknown>): Promise<VehiclePersistenceResult> {
    console.log('🆕 Creating new vehicle...');
    console.log('📤 Create payload:', vehicleFormData);

    try {
      const newVehicle = await apiRequest('/policy/vehicle-details', {
        method: 'POST',
        body: JSON.stringify(vehicleFormData),
      });
      
      console.log('✅ Vehicle created successfully:', newVehicle);
      return {
        success: true,
        data: newVehicle,
        message: 'Vehicle created successfully',
        isUpdate: false
      };
    } catch (error) {
      console.error('❌ Failed to create vehicle:', error);
      throw new Error(`Failed to create vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Build vehicle payload from form data
  buildVehiclePayload(formData: VehicleFormData): Record<string, unknown> {
    console.log('🏗️ Building vehicle payload from form data...');
    console.log('📋 Input form data:', formData);

    const { selectedType, carType, usageType, vehicleData, ownershipData, documents, commercialCategories1, commercialCategories2 } = formData;

    // Map frontend values to backend format
    const mapCarTypeToBackendCategory = (carTypeOrCategory: string): string => {
      // Handle private vehicle categories
      const privateMapping: Record<string, string> = {
        'passenger': 'Passenger Car',
        'suvs': 'SUV',
        'pickup': 'Pickup Truck',
        'minivan': 'Van',
      };
      
      // Handle commercial vehicle categories (already in proper format)
      const commercialMapping: Record<string, string> = {
        'Commercial Bus': 'Commercial Bus',
        'Commercial Truck': 'Commercial Truck',
        'Commercial PCV': 'Commercial PCV',
        'Commercial GCV': 'Commercial GCV',
        'Commercial Vehicle': 'Commercial Vehicle',
      };
      
      // Try private mapping first, then commercial, then default
      return privateMapping[carTypeOrCategory] || 
             commercialMapping[carTypeOrCategory] || 
             carTypeOrCategory || 
             'Passenger Car';
    };

    const mapUsageTypeToArray = (usageTypeValue: string): string[] => {
      if (usageTypeValue === 'personal' || usageTypeValue === 'Personal Use') return ['Personal Use'];
      if (usageTypeValue === 'business' || usageTypeValue === 'Business') return ['Business'];
      if (usageTypeValue === 'commercial' || usageTypeValue === 'Commercial Use') return ['Commercial Use'];
      return ['Personal Use'];
    };

    // Helper function to determine commercial vehicle metadata
    const analyzeCommercialCategories = (categories1: Record<string, boolean> = {}, categories2: Record<string, boolean> = {}) => {
      const allCategories = { ...categories1, ...categories2 };
      const selectedKeys = Object.keys(allCategories).filter(key => allCategories[key]);
      
      let primaryVehicleType = 'Passenger Carrying';
      let size = 'Medium';
      let subCategory = 'General Commercial';
      
      // Determine primary type
      if (selectedKeys.some(key => key.includes('liquid'))) {
        primaryVehicleType = 'Liquid Cargo Carrying';
      } else if (selectedKeys.some(key => key.includes('goods') || key.includes('cartage') || key.includes('gcv'))) {
        primaryVehicleType = 'Goods Carrying';
      } else if (selectedKeys.some(key => key.includes('taxi') || key.includes('bus') || key.includes('pcv'))) {
        primaryVehicleType = 'Passenger Carrying';
      }
      
      // Determine size
      if (selectedKeys.some(key => key.includes('small'))) {
        size = 'Small';
      } else if (selectedKeys.some(key => key.includes('large'))) {
        size = 'Large';
      } else if (selectedKeys.some(key => key.includes('medium'))) {
        size = 'Medium';
      }
      
      // Determine subcategory
      if (selectedKeys.some(key => key.includes('taxi'))) {
        subCategory = 'Taxi Services';
      } else if (selectedKeys.some(key => key.includes('bus'))) {
        subCategory = 'Bus Services';
      } else if (selectedKeys.some(key => key.includes('own_goods'))) {
        subCategory = 'Own Goods Transport';
      } else if (selectedKeys.some(key => key.includes('cartage'))) {
        subCategory = 'Cartage Services';
      } else if (selectedKeys.some(key => key.includes('pcv'))) {
        subCategory = 'Public Carrying Vehicle';
      } else if (selectedKeys.some(key => key.includes('gcv'))) {
        subCategory = 'Goods Carrying Vehicle';
      }
      
      return { primaryVehicleType, size, subCategory };
    };

    if (selectedType === 'private') {
      const vehicleDetails: Record<string, unknown> = {
        usageType: mapUsageTypeToArray(usageType),
        vehicleCategory: mapCarTypeToBackendCategory(carType),
        generalDetails: {
          make: vehicleData.make || '',
          model: vehicleData.model || '',
          manufacturingYear: vehicleData.mfgYear ? parseInt(vehicleData.mfgYear, 10) : null,
          chassisNumber: vehicleData.chassisNo || '',
          engineCapacity: vehicleData.engineCapacity ? parseInt(vehicleData.engineCapacity, 10) : null,
          plateNumber: vehicleData.plateNo || '',
          bodyType: vehicleData.bodyType || '',
          engineNumber: vehicleData.engineNo || ''
        },
        ownershipUsage: {
          ownerType: ownershipData.ownerType || '',
          purchasedValue: ownershipData.purchasedValue ? parseInt(ownershipData.purchasedValue, 10) : null,
          dutyFree: ownershipData.dutyFree === 'Yes',
          driverType: ownershipData.driverType || '',
          seatingCapacity: ownershipData.seatingCapacity ? parseInt(ownershipData.seatingCapacity, 10) : null
        }
      };

      // Add documents if they exist
      if (documents && (documents.driversLicense || documents.vehicleLibre)) {
        vehicleDetails.documents = {
          ...(documents.driversLicense && { driversLicense: documents.driversLicense }),
          ...(documents.vehicleLibre && { vehicleLibre: documents.vehicleLibre })
        };
      }

      const payload = {
        vehicleType: 'Private',
        privateVehicle: vehicleDetails
      };

      console.log('✅ Private vehicle payload built:', payload);
      return payload;
    } else {
      // Commercial vehicle payload
      const commercialMeta = analyzeCommercialCategories(commercialCategories1, commercialCategories2);
      
      const vehicleDetails: Record<string, unknown> = {
        // Store detailed categories
        selectedCategories: {
          category1: commercialCategories1 || {},
          category2: commercialCategories2 || {}
        },
        
        // Simplified categorization for backend processing
        primaryVehicleType: commercialMeta.primaryVehicleType,
        subCategory: commercialMeta.subCategory,
        size: commercialMeta.size,
        
        usageType: mapUsageTypeToArray(usageType),
        vehicleCategory: mapCarTypeToBackendCategory(carType),
        
        generalDetails: {
          make: vehicleData.make || '',
          model: vehicleData.model || '',
          manufacturingYear: vehicleData.mfgYear ? parseInt(vehicleData.mfgYear, 10) : null,
          chassisNumber: vehicleData.chassisNo || '',
          engineCapacity: vehicleData.engineCapacity ? parseInt(vehicleData.engineCapacity, 10) : null,
          plateNumber: vehicleData.plateNo || '',
          bodyType: vehicleData.bodyType || '',
          engineNumber: vehicleData.engineNo || ''
        },
        ownershipUsage: {
          ownerType: ownershipData.ownerType || '',
          purchasedValue: ownershipData.purchasedValue ? parseInt(ownershipData.purchasedValue, 10) : null,
          dutyFree: ownershipData.dutyFree === 'Yes',
          driverType: ownershipData.driverType || '',
          seatingCapacity: ownershipData.seatingCapacity ? parseInt(ownershipData.seatingCapacity, 10) : null
        }
      };

      // Add documents if they exist
      if (documents && (documents.driversLicense || documents.vehicleLibre)) {
        vehicleDetails.documents = {
          ...(documents.driversLicense && { driversLicense: documents.driversLicense }),
          ...(documents.vehicleLibre && { vehicleLibre: documents.vehicleLibre })
        };
      }

      const payload = {
        vehicleType: 'Commercial',
        commercialVehicle: vehicleDetails
      };

      console.log('✅ Commercial vehicle payload built:', payload);
      return payload;
    }
  }
};

// Vehicle API functions
export const vehicleApi = {
  // Get all user's vehicles
  async getUserVehicles() {
    console.log('🚗 Fetching user vehicles...');
    try {
      const vehicles = await apiRequest('/policy/user-vehicles');
      console.log(`✅ Found ${vehicles?.length || 0} vehicles for user`);
      return vehicles;
    } catch (error) {
      console.error('❌ Failed to fetch user vehicles:', error);
      throw new Error('Failed to fetch user vehicles');
    }
  },

  // Get single vehicle details
  async getVehicleDetails(id: string) {
    console.log(`🚗 Fetching vehicle details for ID: ${id}`);
    try {
      const vehicle = await apiRequest(`/policy/vehicle-details/${id}`);
      console.log('✅ Vehicle details fetched:', vehicle);
      return vehicle;
    } catch (error) {
      console.error(`❌ Failed to fetch vehicle details for ID ${id}:`, error);
      throw new Error('Failed to fetch vehicle details');
    }
  },

  // Update existing vehicle
  async updateVehicle(id: string, data: Record<string, unknown>) {
    console.log(`🚗 Updating vehicle ID: ${id}`);
    console.log('📤 Update data:', data);
    try {
      const updatedVehicle = await apiRequest(`/policy/vehicle-details/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      console.log('✅ Vehicle updated successfully:', updatedVehicle);
      return updatedVehicle;
    } catch (error) {
      console.error(`❌ Failed to update vehicle ID ${id}:`, error);
      throw new Error('Failed to update vehicle');
    }
  },

  // Create new vehicle
  async createVehicle(data: Record<string, unknown>) {
    console.log('🚗 Creating new vehicle...');
    console.log('📤 Vehicle data:', data);
    try {
      const newVehicle = await apiRequest('/policy/vehicle-details', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('✅ Vehicle created successfully:', newVehicle);
      return newVehicle;
    } catch (error) {
      console.error('❌ Failed to create vehicle:', error);
      throw new Error('Failed to create vehicle');
    }
  },
}; 