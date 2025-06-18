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
    employDriver: string;
    drivers: Array<{
      driverLicenseGrade: string;
      driverName: string;
      drivingExperience: string;
    }>;
    employDriverUnder21: string;
    physicalInfirmity: string;
    lessThanSixMonthsExperience: string;
    fullName: string;
    signatureDate: string;
    acceptTerms: boolean;
  };
  // NEW: Vehicle Information from policy selection flow
  vehicleInformation?: {
    coverRequired: string;
    make: string;
    value: string;
    vehicleInGoodRepair: string;
    vehicleLeftOvernight: string;
    soleProperty: string;
    ownerName: string;
    ownerAddress: string;
    privateUse: string;
    otherUses: string;
    convicted: string;
    convictionDetails: string;
    insuredBefore: string;
    insurerName: string;
    companyHistory: string[];
    hadAccidents: string;
    accidentDetails: string;
    claimsInjury: string;
    claimsInjuryDetails: string;
    claimsProperty: string;
    claimsPropertyDetails: string;
    personalAccident: string;
    passengersInsured: string;
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
  "Ethiopia & Moyale (Kenya Border)": "Kenya Border",
  "Ethiopia & Djibouti": "Djibouti Border", 
  "Ethiopia & Metema (Sudan Border)": "Sudan Border",
  "Ethiopia & Humera (Eritrea Border)": "Eritrea Border"
};

// Policy type mapping for backend compatibility  
const POLICY_TYPE_MAPPING: Record<string, string> = {
  "Compulsory Third-Party Cover": "Compulsory Third-Party Cover",
  "Own Damage Cover": "Own Damage Cover", 
  "Comprehensive Cover": "Comprehensive Cover"
};

// Premium calculation based on policy type, duration, and coverage
const calculatePremium = (
  policyType: string,
  durationDays: number,
  coverageArea: string,
  vehicleValue?: number
): number => {

  // Base premium rates (per day)
  const basePremiumRates: Record<string, number> = {
    "Compulsory Third-Party Cover": 15,
    "Own Damage Cover": 25,
    "Comprehensive Cover": 35
  };

  // Coverage area multipliers
  const coverageMultipliers: Record<string, number> = {
    "Ethiopia Only": 1.0,
    "Kenya Border": 1.2,
    "Djibouti Border": 1.3,
    "Sudan Border": 1.25,
    "Eritrea Border": 1.15
  };

  const mappedPolicyType = POLICY_TYPE_MAPPING[policyType] || policyType;
  const mappedCoverageArea = COVERAGE_AREA_MAPPING[coverageArea] || coverageArea;
  
  const baseRate = basePremiumRates[mappedPolicyType] || basePremiumRates["Compulsory Third-Party Cover"];
  const coverageMultiplier = coverageMultipliers[mappedCoverageArea] || 1.0;
  
  let premium = baseRate * durationDays * coverageMultiplier;
  
  // Add vehicle value factor for comprehensive and own damage
  if ((mappedPolicyType === "Comprehensive Cover" || mappedPolicyType === "Own Damage Cover") && vehicleValue) {
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
  
  return finalPremium;
};

// Validation functions
const validatePolicyData = (policySelection: PolicySelectionDto): {
  isValid: boolean;
  errors: string[];
  transformedData?: Record<string, unknown>;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  
  // Return transformed data - simplified for current backend DTO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedData: Record<string, any> = {
    vehicleId: policySelection.vehicleId,
    selectedPolicy: mappedPolicyType,
    policyDuration: durationDays,
    jurisdiction: mappedCoverageArea,
    premium: premium,
    acceptTerms: true // Required by backend DTO
  };
  
  // Only include vehicle data if it exists
  if (policySelection.vehicleData) {
    transformedData.vehicleData = policySelection.vehicleData;
  }
  
  // Transform and include driver data if it exists
  if (policySelection.driverData) {
    transformedData.driverData = transformDriverInformation(policySelection.driverData);
  }
  
  // Include vehicleInformation if it exists
  if (policySelection.vehicleInformation) {
    transformedData.vehicleInformation = transformVehicleInformation(policySelection.vehicleInformation);
  }
  

  
  return { isValid: true, errors: [], transformedData };
};

// Policy Selection Service
export const policySelectionService = {
  /**
   * Save policy selection data
   */
  async savePolicySelection(policySelection: PolicySelectionDto): Promise<PolicySelectionResponse> {

    
    // Validate and transform data
    const validation = validatePolicyData(policySelection);
    
    if (!validation.isValid) {
      console.error('❌ Validation errors:', validation.errors);
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    

    
    try {
      const response = await apiClient.post('/policy/policy-selection', validation.transformedData);
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
    
    try {
      const response = await apiClient.get(`/policy/vehicle/${vehicleId}`);
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
    employDriver: string;
    drivers: Array<{
      driverLicenseGrade: string;
      driverName: string;
      drivingExperience: string;
    }>;
    employDriverUnder21: string;
    physicalInfirmity: string;
    lessThanSixMonthsExperience: string;
    fullName: string;
    signatureDate: string;
    acceptTerms: boolean;
  },
  vehicleInformation?: {
    coverRequired: string;
    make: string;
    value: string;
    vehicleInGoodRepair: string;
    vehicleLeftOvernight: string;
    soleProperty: string;
    ownerName: string;
    ownerAddress: string;
    privateUse: string;
    otherUses: string;
    convicted: string;
    convictionDetails: string;
    insuredBefore: string;
    insurerName: string;
    companyHistory: string[];
    hadAccidents: string;
    accidentDetails: string;
    claimsInjury: string;
    claimsInjuryDetails: string;
    claimsProperty: string;
    claimsPropertyDetails: string;
    personalAccident: string;
    passengersInsured: string;
  }
): PolicySelectionDto => {

  return {
    vehicleId,
    selectedPolicy,
    policyDuration,
    jurisdiction,
    ...(vehicleData && { vehicleData }),
    ...(driverData && { driverData }),
    ...(vehicleInformation && { vehicleInformation })
  };
};

// Export utility functions for external use
export { validatePolicyData, calculatePremium, DURATION_MAPPING, COVERAGE_AREA_MAPPING, POLICY_TYPE_MAPPING };

// Helper function to convert yes/no strings to boolean
const convertYesNoToBoolean = (value: string): boolean => {
  return value === 'yes';
};

// Helper function to transform vehicle information for backend
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformVehicleInformation = (vehicleInfo: any) => {
  if (!vehicleInfo) return undefined;
  
  return {
    coverRequired: convertYesNoToBoolean(vehicleInfo.coverRequired),
    make: vehicleInfo.make || undefined,
    value: vehicleInfo.value ? parseFloat(vehicleInfo.value) : undefined,
    vehicleInGoodRepair: convertYesNoToBoolean(vehicleInfo.vehicleInGoodRepair),
    vehicleLeftOvernight: vehicleInfo.vehicleLeftOvernight,
    soleProperty: convertYesNoToBoolean(vehicleInfo.soleProperty),
    ownerName: vehicleInfo.ownerName || undefined,
    ownerAddress: vehicleInfo.ownerAddress || undefined,
    privateUse: convertYesNoToBoolean(vehicleInfo.privateUse),
    otherUses: vehicleInfo.otherUses || undefined,
    convicted: convertYesNoToBoolean(vehicleInfo.convicted),
    convictionDetails: vehicleInfo.convictionDetails || undefined,
    insuredBefore: convertYesNoToBoolean(vehicleInfo.insuredBefore),
    insurerName: vehicleInfo.insurerName || undefined,
    companyHistory: vehicleInfo.companyHistory || undefined,
    hadAccidents: convertYesNoToBoolean(vehicleInfo.hadAccidents),
    accidentDetails: vehicleInfo.accidentDetails || undefined,
    claimsInjury: convertYesNoToBoolean(vehicleInfo.claimsInjury),
    claimsInjuryDetails: vehicleInfo.claimsInjuryDetails || undefined,
    claimsProperty: convertYesNoToBoolean(vehicleInfo.claimsProperty),
    claimsPropertyDetails: vehicleInfo.claimsPropertyDetails || undefined,
    personalAccident: convertYesNoToBoolean(vehicleInfo.personalAccident),
    passengersInsured: convertYesNoToBoolean(vehicleInfo.passengersInsured)
  };
};

// Helper function to transform driver information for backend
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformDriverInformation = (driverInfo: any) => {
  if (!driverInfo) return undefined;
  
  return {
    employDriver: convertYesNoToBoolean(driverInfo.employDriver),
    drivers: driverInfo.drivers || undefined,
    employDriverUnder21: convertYesNoToBoolean(driverInfo.employDriverUnder21),
    physicalInfirmity: convertYesNoToBoolean(driverInfo.physicalInfirmity),
    lessThanSixMonthsExperience: convertYesNoToBoolean(driverInfo.lessThanSixMonthsExperience),
    fullName: driverInfo.fullName || undefined,
    signatureDate: driverInfo.signatureDate || undefined,
    acceptTerms: driverInfo.acceptTerms
  };
};

export default policySelectionService; 