import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccidentDetails from '@/components/ClaimSubmission/accidentDetails';
import { useAccidentDetailsStore } from '@/store/claimSubmission/accident-details';
import { useRouter } from 'next/navigation';
import axios from 'axios';

jest.mock('@/store/claimSubmission/accident-details');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));
jest.mock('axios');

const mockUseAccidentDetailsStore = useAccidentDetailsStore as jest.MockedFunction<typeof useAccidentDetailsStore>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('AccidentDetails', () => {
    const mockRouterPush = jest.fn();
    const mockSetError = jest.fn();
    const baseStore = {
        otherVehicles: [
            {
                driverName: '',
                driverAddress: '',
                driverPhone: ''
            }
        ],
        positionOnRoad: null,
        roadSurface: '',
        trafficCondition: '',
        additionalDescription: '',
        timeOfDay: '',
        dateOfAccident: '',
        timeOfAccident: '',
        speed: 0,
        location: {
            city: '',
            subCity: '',
            kebele: '',
            sefer: ''
        },
        hornSounded: '',
        headlightsOn: '',
        wereYouInVehicle: '',
        visibilityObstructions: null,
        intersectionType: '',
        error: '',
        addVehicle: jest.fn(),
        removeVehicle: jest.fn(),
        updateVehicle: jest.fn(),
        setpositionOnRoad: jest.fn(),
        setRoadSurface: jest.fn(),
        setTrafficCondition: jest.fn(),
        setadditionalDescription: jest.fn(),
        setTimeOfDay: jest.fn(),
        setdateOfAccident: jest.fn(),
        settimeOfAccident: jest.fn(),
        setspeed: jest.fn(),
        setlocation: jest.fn(),
        sethornSounded: jest.fn(),
        setHeadlightsOn: jest.fn(),
        setwereYouInVehicle: jest.fn(),
        setVisibilityObstructions: jest.fn(),
        setintersectionType: jest.fn(),
        addSketchFile: jest.fn(),
        setError: mockSetError
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue({ push: mockRouterPush } as any);
        mockUseAccidentDetailsStore.mockReturnValue(baseStore);
    });

    it('renders the component with progress steps', () => {
        render(<AccidentDetails />);
        expect(screen.getByText('Claim Submission')).toBeInTheDocument();
        expect(screen.getByText('Accident Details')).toBeInTheDocument();
        expect(screen.getByText('Save as draft')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
        render(<AccidentDetails />);
        expect(screen.getByLabelText('Date of Accident *')).toBeInTheDocument();
        expect(screen.getByLabelText('Time of Accident *')).toBeInTheDocument();
        expect(screen.getByLabelText('Speed (km/h) *')).toBeInTheDocument();
        expect(screen.getByText('Position of Vehicle on Road (Relative to Road Edge)')).toBeInTheDocument();
    });

    it('handles radio button selections', () => {
        render(<AccidentDetails />);
        fireEvent.click(screen.getByLabelText('Left Side of Lane'));
        expect(baseStore.setpositionOnRoad).toHaveBeenCalledWith('Left Side of Lane');
        fireEvent.click(screen.getByLabelText('Asphalt'));
        expect(baseStore.setRoadSurface).toHaveBeenCalledWith('Asphalt');
        fireEvent.click(screen.getByLabelText('Not Crowded'));
        expect(baseStore.setTrafficCondition).toHaveBeenCalledWith('Not Crowded');
    });


    it('adds and removes vehicles', () => {
        render(<AccidentDetails />);
        fireEvent.click(screen.getByText('+'));
        expect(baseStore.addVehicle).toHaveBeenCalled();
    });

    it('validates required fields before submission', () => {
        render(<AccidentDetails />);

        const nextButton = screen.getByLabelText('Next Step');
        fireEvent.click(nextButton);


        expect(mockSetError)
    });

    it('navigates to previous page', () => {
        render(<AccidentDetails />);
        fireEvent.click(screen.getByText('Previous'));
        expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/driver-details');
    });
});
