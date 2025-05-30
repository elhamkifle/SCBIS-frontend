import { render, screen, fireEvent } from '@testing-library/react';
import WitnessInformation from '@/components/ClaimSubmission/witnessInformation';
import { useWitnessInformationStore } from '@/store/claimSubmission/witness-information';
import { useRouter } from 'next/navigation';

jest.mock('@/store/claimSubmission/witness-information');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockUseWitnessStore = useWitnessInformationStore as jest.MockedFunction<typeof useWitnessInformationStore>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

// Helper to create fresh mock store per test
function createMockStore(overrides = {}) {
    return {
        aloneInVehicle: '',
        vehicleOccupants: [{ name: '', contact: '' }],
        independentWitnessPresent: '',
        independentWitnesses: [{ name: '', contact: '' }],
        whyNoWitness: '',
        setAloneInVehicle: jest.fn(),
        addVehicleOccupant: jest.fn(),
        updateVehicleOccupant: jest.fn(),
        removeVehicleOccupant: jest.fn(),
        setindependentWitnessPresent: jest.fn(),
        addIndependentWitness: jest.fn(),
        updateIndependentWitness: jest.fn(),
        removeIndependentWitness: jest.fn(),
        setwhyNoWitness: jest.fn(),
        ...overrides,
    };
}

describe('WitnessInformation', () => {
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue({ push: mockRouterPush } as any);
    });

    it('renders the component with progress steps and headers', () => {
        const store = createMockStore();
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);
        expect(screen.getByText('Claim Submission')).toBeInTheDocument();
        expect(screen.getByText('Witness Information')).toBeInTheDocument();
        expect(screen.getByText('Save as draft')).toBeInTheDocument();
    });

    it('renders alone in vehicle radio buttons and handles selection', () => {
        const store = createMockStore();
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);
        const yesRadio = screen.getByLabelText('Yes I was');
        const noRadio = screen.getByLabelText("No I wasn't alone");

        fireEvent.click(yesRadio);
        expect(store.setAloneInVehicle).toHaveBeenCalledWith('Yes I was');

        fireEvent.click(noRadio);
        expect(store.setAloneInVehicle).toHaveBeenCalledWith("No I wasn't alone");
    });

    it('renders vehicle occupants form when not alone and handles interactions', () => {
        // Mock store with not alone and two occupants
        const store = createMockStore({
            aloneInVehicle: "No I wasn't alone",
            vehicleOccupants: [{ name: '', contact: '' }, { name: '', contact: '' }],
        });
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);

        // Test adding occupant
        const addButton = screen.getByText('+');
        fireEvent.click(addButton);
        expect(store.addVehicleOccupant).toHaveBeenCalled();

        // Test updating occupant
        const witnessNameInputs = screen.getAllByLabelText('Full Name');
        fireEvent.change(witnessNameInputs[0], { target: { value: 'Alice' } });
        expect(store.updateIndependentWitness);


        const witnessContactInputs = screen.getAllByLabelText('Address/Phone Number');
        fireEvent.change(witnessContactInputs[0], { target: { value: '456 Oak Ave' } });
        expect(store.updateIndependentWitness);



        // Test removing occupant (with multiple occupants)
        const removeButtons = screen.getAllByText('-');
        fireEvent.click(removeButtons[0]);
        expect(store.removeVehicleOccupant).toHaveBeenCalledWith(1);
    });

    it('renders independent witness radios and handles selection', () => {
        const store = createMockStore();
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);
        const yesRadio = screen.getByLabelText('Yes');
        const yesNoNamesRadio = screen.getByLabelText('Yes. I dont have their names');
        const noRadio = screen.getByLabelText('No, there were no witnesses');

        fireEvent.click(yesRadio);
        expect(store.setindependentWitnessPresent).toHaveBeenCalledWith('Yes');

        fireEvent.click(yesNoNamesRadio);
        expect(store.setindependentWitnessPresent).toHaveBeenCalledWith('Yes. I dont have their names');

        fireEvent.click(noRadio);
        expect(store.setindependentWitnessPresent).toHaveBeenCalledWith('No, there were no witnesses');
    });

    it('renders witness form when "Yes" selected and handles interactions', () => {
        // Mock store with independentWitnessPresent "Yes" and two witnesses
        const store = createMockStore({
            independentWitnessPresent: 'Yes',
            independentWitnesses: [{ name: '', contact: '' }, { name: '', contact: '' }],
        });
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);

        // Test adding witness
        const addButton = screen.getByText('+');
        fireEvent.click(addButton);
        expect(store.addIndependentWitness).toHaveBeenCalled();

        // Test updating witness
        // Test updating occupant
        const witnessNameInputs = screen.getAllByLabelText('Full Name');
        fireEvent.change(witnessNameInputs[0], { target: { value: 'Alice' } });
        expect(store.updateIndependentWitness);


        const witnessContactInputs = screen.getAllByLabelText('Address/Phone Number');
        fireEvent.change(witnessContactInputs[0], { target: { value: '456 Oak Ave' } });
        expect(store.updateIndependentWitness);

        // Test removing witness
        const removeButtons = screen.getAllByText('-');
        fireEvent.click(removeButtons[0]);
        expect(store.removeIndependentWitness).toHaveBeenCalledWith(1);
    });

    it('renders reason textarea when "Yes no names" selected', () => {
        const store = createMockStore({
            independentWitnessPresent: 'Yes. I dont have their names',
        });
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);

        const textarea = screen.getByPlaceholderText('Reason');
        fireEvent.change(textarea, { target: { value: 'They left quickly' } });
        expect(store.setwhyNoWitness).toHaveBeenCalledWith('They left quickly');
    });

    it('navigates to previous page when Previous button clicked', () => {
        const store = createMockStore();
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);
        fireEvent.click(screen.getByText('Previous'));
        expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/liability-information');
    });

    it('navigates to next page when Next button clicked', () => {
        const store = createMockStore();
        mockUseWitnessStore.mockReturnValue(store);
        render(<WitnessInformation />);
        fireEvent.click(screen.getByText('Next'));
        expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/damage-details');
    });
});
