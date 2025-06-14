import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClaimPolicySelection from '@/components/ClaimSubmission/claim-policy-selection';
import { useClaimPolicyStore } from '@/store/claimSubmission/claim-policy-selection';
import axios from 'axios';

// Mock the required dependencies
jest.mock('@/store/claimSubmission/claim-policy-selection');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));
jest.mock('axios');

const mockUseClaimPolicyStore = useClaimPolicyStore as jest.MockedFunction<typeof useClaimPolicyStore>;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('ClaimPolicySelection', () => {
  const mockPolicies = [
    {
      _id: 'policy1',
      title: 'Comprehensive Auto Policy',
      coverageEndDate: '2024-12-31',
      territory: 'National',
      duration: '1 Year',
      privateVehicle: {
        generalDetails: {
          make: 'Toyota',
          model: 'Camry',
          plateNumber: 'ABC123'
        }
      }
    },
    {
      _id: 'policy2',
      title: 'Basic Auto Policy',
      coverageEndDate: '2024-06-30',
      territory: 'State',
      duration: '6 Months',
      commercialVehicle: {
        generalDetails: {
          make: 'Ford',
          model: 'Transit',
          plateNumber: 'XYZ789'
        }
      }
    }
  ];

  const mockSelectPolicy = jest.fn();
  const mockAddPolicies = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    // Mock the router implementation
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
      push: mockRouterPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }));

    mockUseClaimPolicyStore.mockReturnValue({
      policies: mockPolicies,
      selectedPolicy: null,
      selectPolicy: mockSelectPolicy,
      addPolicies: mockAddPolicies
    });

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'auth_token=mock-token'
    });

    // Mock axios response
    mockAxios.get.mockResolvedValue({ data: mockPolicies });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with header and title', () => {
    render(<ClaimPolicySelection />);
    
    expect(screen.getByText('Claim Submission')).toBeInTheDocument();
    expect(screen.getByText('Save as draft')).toBeInTheDocument();
    expect(screen.getByText('Select the Relevant Insurance Policy for this Claim')).toBeInTheDocument();
    expect(screen.getByText('Please select the insurance policy by clicking the card.')).toBeInTheDocument();
  });

  it('fetches policies on mount', async () => {
    render(<ClaimPolicySelection />);
    
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/policy/user-policies',
        {
          headers: {
            Authorization: 'Bearer mock-token'
          }
        }
      );
      expect(mockAddPolicies).toHaveBeenCalledWith(mockPolicies);
    });
  });



  it('allows selecting a policy', async () => {
    render(<ClaimPolicySelection />);
    
    await waitFor(() => {
      const firstPolicyCard = screen.getByText(mockPolicies[0].title).closest('div');
      if (firstPolicyCard) {
        fireEvent.click(firstPolicyCard);
        expect(mockSelectPolicy).toHaveBeenCalledWith(mockPolicies[0]._id);
      }
    });
  });

  it('shows error when trying to proceed without selecting a policy', async () => {
    render(<ClaimPolicySelection />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Please select an insurance coverage to continue.')).toBeInTheDocument();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('navigates to next page when policy is selected', async () => {
    // Mock with selected policy
    mockUseClaimPolicyStore.mockReturnValueOnce({
      policies: mockPolicies,
      selectedPolicy: mockPolicies[0]._id,
      selectPolicy: mockSelectPolicy,
      addPolicies: mockAddPolicies
    });

    render(<ClaimPolicySelection />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/claim-disclaimer');
  });

  it('navigates to previous page when Previous button is clicked', () => {
    render(<ClaimPolicySelection />);
    
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);
    
    expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/vehicle-selection');
  });

  it('handles API errors gracefully', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('API Error'));
    console.error = jest.fn();
    
    render(<ClaimPolicySelection />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching policies:', expect.any(Error));
    });
  });

  it('shows selected policy with border highlight', async () => {
    // Mock with selected policy
    mockUseClaimPolicyStore.mockReturnValueOnce({
      policies: mockPolicies,
      selectedPolicy: mockPolicies[0]._id,
      selectPolicy: mockSelectPolicy,
      addPolicies: mockAddPolicies
    });

    render(<ClaimPolicySelection />);
    
    const selectedPolicyCard = screen.getByText(mockPolicies[0].title).closest('div');
    expect(selectedPolicyCard).toHaveClass('border-2');
    expect(selectedPolicyCard).toHaveClass('border-green-500');
    
    const unselectedPolicyCard = screen.getByText(mockPolicies[1].title).closest('div');
    expect(unselectedPolicyCard).toHaveClass('border');
    expect(unselectedPolicyCard).toHaveClass('border-gray-300');
  });
});