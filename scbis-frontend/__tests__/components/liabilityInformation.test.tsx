import { render, screen, fireEvent } from '@testing-library/react';
import LiabilityInformation from '@/components/ClaimSubmission/liabilityInformation';
import { useLiabilityInformationStore } from '@/store/claimSubmission/liability-information';
import { useRouter } from 'next/navigation';
import { within } from '@testing-library/react';

jest.mock('@/store/claimSubmission/liability-information');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockUseLiabilityStore = useLiabilityInformationStore as jest.MockedFunction<typeof useLiabilityInformationStore>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('LiabilityInformation', () => {
    const mockRouterPush = jest.fn();

    const baseStore = {
        responsibleParty: '',
        otherInsuredStatus: '',
        OtherInsuranceCompanyName: '',
        policeInvolved: '',
        policeOfficerName: '',
        policeStation: '',
        setResponsibleParty: jest.fn(),
        setOtherInsuredStatus: jest.fn(),
        setOtherInsuranceCompanyName: jest.fn(),
        setPoliceInvolved: jest.fn(),
        setpoliceOfficerName: jest.fn(),
        setPoliceStation: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue({ push: mockRouterPush } as any);
        mockUseLiabilityStore.mockReturnValue(baseStore);
    });

    it('renders the component with progress steps and headers', () => {
        render(<LiabilityInformation />);
        expect(screen.getByText('Claim Submission')).toBeInTheDocument();
        expect(screen.getByText('Liability & Insurance Information')).toBeInTheDocument();
        expect(screen.getByText('Save as draft')).toBeInTheDocument();
        expect(screen.getByText('Determine liability and other insurance details')).toBeInTheDocument();
    });

    it('renders responsible party radio buttons and handles selection', () => {
        render(<LiabilityInformation />);
        const myselfRadio = screen.getByLabelText('Myself');
        const otherPersonRadio = screen.getByLabelText('The other person');

        fireEvent.click(myselfRadio);
        expect(baseStore.setResponsibleParty).toHaveBeenCalledWith('Myself');

        fireEvent.click(otherPersonRadio);
        expect(baseStore.setResponsibleParty).toHaveBeenCalledWith('The other person');
    });

    it('renders other insured status radios and toggles conditional input', () => {
        render(<LiabilityInformation />);

        // Initially input not shown
        expect(screen.queryByLabelText('Name of the Insurance Company')).not.toBeInTheDocument();

        // Select "I dont know" - no input shown
        fireEvent.click(screen.getByLabelText('I dont know'));
        expect(baseStore.setOtherInsuredStatus).toHaveBeenCalledWith('I dont know');
        expect(screen.queryByLabelText('Name of the Insurance Company')).not.toBeInTheDocument();

        // Update mock store to simulate "Yes , they are" selection
        mockUseLiabilityStore.mockReturnValue({
            ...baseStore,
            otherInsuredStatus: 'Yes , they are',
        });
        render(<LiabilityInformation />);
        expect(screen.getByLabelText('Name of the Insurance Company')).toBeInTheDocument();

        // Change text input value
        fireEvent.change(screen.getByLabelText('Name of the Insurance Company'), { target: { value: 'ABC Insurance' } });
        expect(baseStore.setOtherInsuranceCompanyName).toHaveBeenCalledWith('ABC Insurance');
    });

    it('renders police involvement radios and toggles conditional inputs', () => {
        render(<LiabilityInformation />);

        // Initially inputs are not present
        expect(screen.queryByLabelText("Police Officer’s Name")).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Police Station')).not.toBeInTheDocument();

        const policeText = screen.getByText('Were particulars taken by police?');
        const policeSection = policeText.parentElement;


        if (!policeSection) {
            throw new Error('Police section container not found');
        }

        const noRadio = within(policeSection).getByLabelText('No');
        fireEvent.click(noRadio);

        expect(baseStore.setPoliceInvolved).toHaveBeenCalledWith('No');
        expect(screen.queryByLabelText("Police Officer’s Name")).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Police Station')).not.toBeInTheDocument();

        // Update mock store to simulate "Yes" selected
        mockUseLiabilityStore.mockReturnValue({
            ...baseStore,
            policeInvolved: 'Yes',
        });
        render(<LiabilityInformation />);
        expect(screen.getByLabelText("Police Officer’s Name")).toBeInTheDocument();
        expect(screen.getByLabelText('Police Station')).toBeInTheDocument();

        // Change Police Officer's Name
        fireEvent.change(screen.getByLabelText("Police Officer’s Name"), { target: { value: 'Officer John' } });
        expect(baseStore.setpoliceOfficerName).toHaveBeenCalledWith('Officer John');

        // Change Police Station
        fireEvent.change(screen.getByLabelText('Police Station'), { target: { value: 'Central Station' } });
        expect(baseStore.setPoliceStation).toHaveBeenCalledWith('Central Station');
    });

    it('navigates to previous page when Previous button clicked', () => {
        render(<LiabilityInformation />);
        fireEvent.click(screen.getByText('Previous'));
        expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/accident-details');
    });

    it('navigates to next page when Next button clicked', () => {
        render(<LiabilityInformation />);
        fireEvent.click(screen.getByText('Next'));
        expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/witness-information');
    });
});
