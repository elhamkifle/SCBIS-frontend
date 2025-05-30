// Policy API utilities for policy selection and management
import apiClient from './apiClient';
import { AxiosError } from 'axios';

// Types for policy selection
export interface PolicySelectionDto {
  vehicleId: string;
  selectedPolicy: string;
  policyDuration: string;
  jurisdiction: string;
  vehicleData?: unknown;
  driverData?: {
    employDriver: boolean;
    drivers: unknown[];
    employDriverUnder21: boolean;
    physicalInfirmity: boolean;
    lessThanSixMonthsExperience: boolean;
    fullName: string;
    signatureDate: string;
    acceptTerms: boolean;
  };
}

export interface PolicySelectionResponse {
  _id: string;
  vehicleId: string;
  policyType: string;
  duration: string;
  coverageArea: string;
  premium: number;
  updatedAt: string;
  [key: string]: unknown;
}

// Duration mapping for backend compatibility
const DURATION_MAPPING: Record<string, number> = {
  "3 Days": 3,
  "1 Week": 7,
  "15 Days": 15,
  "1 Month": 30,
  "3 Months": 90,
  "6 Months": 180,
  "1 Year (Recommended)": 365,
  "1 Year": 365
};

// Coverage area mapping for backend compatibility
const COVERAGE_AREA_MAPPING: Record<string, string> = {
  "Ethiopia Only (Valid within Ethiopia's borders.)": "Ethiopia Only",
  "Ethiopia & Moyale (Kenya Border)": "Ethiopia & Moyale",
  "Ethiopia & Djibouti": "Ethiopia & Djibouti", 
  "Ethiopia & Metema (Sudan Border)": "Ethiopia & Metema",
  "Ethiopia & Humera (Eritrea Border)": "Ethiopia & Humera"
};

// Policy type mapping for backend compatibility  
const POLICY_TYPE_MAPPING: Record<string, string> = {
  "Compulsory Third-Party Cover": "Third Party",
  "Third Party": "Third Party",
  "Own Damage Cover": "Own Damage",
  "Own Damage": "Own Damage", 
  "Comprehensive Cover": "Comprehensive"
};

// Premium calculation based on policy type, duration, and coverage
const calculatePremium = (
  policyType: string,
  durationDays: number,
  coverageArea: string,
  vehicleValue?: number
): number => {
  console.log('🧮 Calculating premium for:', { policyType, durationDays, coverageArea, vehicleValue });

  // Base premium rates (per day)
  const basePremiumRates: Record<string, number> = {
    "Third Party": 15,
    "Own Damage": 25,
    "Comprehensive": 35
  };

  // Coverage area multipliers
  const coverageMultipliers: Record<string, number> = {
    "Ethiopia Only": 1.0,
    "Ethiopia & Moyale": 1.2,
    "Ethiopia & Djibouti": 1.3,
    "Ethiopia & Metema": 1.25,
    "Ethiopia & Humera": 1.15
  };

  const mappedPolicyType = POLICY_TYPE_MAPPING[policyType] || policyType;
  const mappedCoverageArea = COVERAGE_AREA_MAPPING[coverageArea] || coverageArea;
  
  const baseRate = basePremiumRates[mappedPolicyType] || basePremiumRates["Third Party"];
  const coverageMultiplier = coverageMultipliers[mappedCoverageArea] || 1.0;
  
  let premium = baseRate * durationDays * coverageMultiplier;
  
  // Add vehicle value factor for comprehensive and own damage
  if ((mappedPolicyType === "Comprehensive" || mappedPolicyType === "Own Damage") && vehicleValue) {
    premium += (vehicleValue * 0.001); // 0.1% of vehicle value
  }
  
  // Apply duration discounts
  if (durationDays >= 365) {
    premium *= 0.85; // 15% discount for 1 year
  } else if (durationDays >= 180) {
    premium *= 0.9; // 10% discount for 6 months
  } else if (durationDays >= 90) {
    premium *= 0.95; // 5% discount for 3 months
  }
  
  const finalPremium = Math.round(premium);
  console.log('💰 Calculated premium:', finalPremium);
  
  return finalPremium;
};

// Validation functions
const validatePolicyData = (policySelection: PolicySelectionDto): {
  isValid: boolean;
  errors: string[];
  transformedData?: {
    vehicleId: string;
    policyType: string;
    duration: number;
    coverageArea: string;
    premium: number;
    vehicleData?: unknown;
    driverData?: unknown;
  };
} => {
  const errors: string[] = [];
  
  // Validate duration
  const durationDays = DURATION_MAPPING[policySelection.policyDuration];
  if (!durationDays) {
    errors.push(`Invalid policy duration: ${policySelection.policyDuration}`);
  }
  
  // Validate coverage area
  const mappedCoverageArea = COVERAGE_AREA_MAPPING[policySelection.jurisdiction];
  if (!mappedCoverageArea) {
    errors.push(`Invalid coverage area: ${policySelection.jurisdiction}`);
  }
  
  // Validate policy type
  const mappedPolicyType = POLICY_TYPE_MAPPING[policySelection.selectedPolicy];
  if (!mappedPolicyType) {
    errors.push(`Invalid policy type: ${policySelection.selectedPolicy}`);
  }
  
  // Validate vehicle ID
  if (!policySelection.vehicleId || policySelection.vehicleId.trim() === '') {
    errors.push('Vehicle ID is required');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Extract vehicle value for premium calculation
  const vehicleData = policySelection.vehicleData as Record<string, any> | undefined;
  const vehicleValueRaw = vehicleData?.ownershipUsage?.purchasedValue || 
                         vehicleData?.purchasedValue || 0;
  const vehicleValue = typeof vehicleValueRaw === 'string' ? 
                      parseInt(vehicleValueRaw, 10) || 0 : 
                      vehicleValueRaw || 0;
  
  // Calculate premium
  const premium = calculatePremium(
    mappedPolicyType!,
    durationDays!,
    mappedCoverageArea!,
    vehicleValue
  );
  
  // Return transformed data
  const transformedData: any = {
    vehicleId: policySelection.vehicleId,
    selectedPolicy: mappedPolicyType,
    policyDuration: durationDays,
    jurisdiction: mappedCoverageArea,
    premium: premium
  };
  
  if (policySelection.vehicleData) {
    transformedData.vehicleData = policySelection.vehicleData;
  }
  
  if (policySelection.driverData) {
    transformedData.driverData = policySelection.driverData;
  }
  
  return { isValid: true, errors: [], transformedData };
};

// Policy Selection Service
export const policySelectionService = {
  /**
   * Save policy selection data
   */
  async savePolicySelection(policySelection: PolicySelectionDto): Promise<PolicySelectionResponse> {
    console.log('🔄 Saving policy selection:', policySelection);
    
    // Validate and transform data
    const validation = validatePolicyData(policySelection);
    
    if (!validation.isValid) {
      console.error('❌ Validation errors:', validation.errors);
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    console.log('✅ Data validated successfully. Sending transformed data:', validation.transformedData);
    
    try {
      const response = await apiClient.post('/policy/policy-selection', validation.transformedData);
      
      console.log('✅ Policy selection saved successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error saving policy selection:', error);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new Error(error.response.data.message || 'Invalid policy selection data');
        } else if (error.response?.status === 404) {
          throw new Error('Vehicle not found. Please complete vehicle details first.');
        } else if (error.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
      }
      throw new Error('Failed to save policy selection. Please try again.');
    }
  },

  /**
   * Get policy details by vehicle ID
   */
  async getPolicyByVehicleId(vehicleId: string): Promise<PolicySelectionResponse> {
    console.log('🔄 Fetching policy for vehicle:', vehicleId);
    
    try {
      const response = await apiClient.get(`/policy/vehicle/${vehicleId}`);
      
      console.log('✅ Policy fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching policy:', error);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('Policy not found for this vehicle');
        } else if (error.response?.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
      }
      throw new Error('Failed to fetch policy details. Please try again.');
    }
  }
};

// Helper function to build policy selection payload (updated)
export const buildPolicySelectionPayload = (
  vehicleId: string,
  selectedPolicy: string,
  policyDuration: string,
  jurisdiction: string,
  vehicleData?: {
    ownershipUsage?: {
      purchasedValue?: number | string;
      [key: string]: unknown;
    };
    purchasedValue?: number | string;
    [key: string]: unknown;
  },
  driverData?: {
    employDriver: boolean;
    drivers: unknown[];
    employDriverUnder21: boolean;
    physicalInfirmity: boolean;
    lessThanSixMonthsExperience: boolean;
    fullName: string;
    signatureDate: string;
    acceptTerms: boolean;
  }
): PolicySelectionDto => {
  console.log('🔧 Building policy selection payload:', {
    vehicleId,
    selectedPolicy,
    policyDuration,
    jurisdiction,
    vehicleData,
    driverData
  });

  return {
    vehicleId,
    selectedPolicy,
    policyDuration,
    jurisdiction,
    ...(vehicleData && { vehicleData }),
    ...(driverData && { driverData })
  };
};

// Export utility functions for external use
export { validatePolicyData, calculatePremium, DURATION_MAPPING, COVERAGE_AREA_MAPPING, POLICY_TYPE_MAPPING };

export default policySelectionService; 