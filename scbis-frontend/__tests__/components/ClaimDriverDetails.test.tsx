import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClaimDriverDetails from '@/components/ClaimSubmission/claim-driver-details';
import { useDriverDetailsStore } from '@/store/claimSubmission/driver-details';
import { useRouter } from 'next/navigation';

// Mock the required dependencies
jest.mock('@/store/claimSubmission/driver-details');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockUseDriverDetailsStore = useDriverDetailsStore as jest.MockedFunction<typeof useDriverDetailsStore>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('ClaimDriverDetails', () => {
    const mockRouterPush = jest.fn();
    const mockSetDriverSame = jest.fn();
    const mockUpdateFormData = jest.fn();

    const initialFormData = {
        firstName: '',
        lastName: '',
        age: '',
        city: '',
        subCity: '',
        kebele: '',
        phoneNumber: '',
        licenseNo: '',
        grade: '',
        expirationDate: ''
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseRouter.mockReturnValue({
            push: mockRouterPush,
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn()
        });

        mockUseDriverDetailsStore.mockReturnValue({
            isDriverSameAsInsured: null,
            formData: initialFormData,
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn()
        });
    });

    it('renders the driver selection question', () => {
        render(<ClaimDriverDetails />);

        expect(screen.getByText(/Was the driver at the moment of accident the same as the insured customer?/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Yes')).toBeInTheDocument();
        expect(screen.getByLabelText('No')).toBeInTheDocument();
    });

    it('calls setDriverSame when radio buttons are clicked', async () => {
        render(<ClaimDriverDetails />);

        fireEvent.click(screen.getByLabelText('Yes'));
        expect(mockSetDriverSame).toHaveBeenCalledWith(true);

        fireEvent.click(screen.getByLabelText('No'));
        expect(mockSetDriverSame).toHaveBeenCalledWith(false);
    });

    it('does not show driver form when driver is same as insured', () => {
        mockUseDriverDetailsStore.mockReturnValueOnce({
            isDriverSameAsInsured: true,
            formData: initialFormData,
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn()
        });

        render(<ClaimDriverDetails />);

        expect(screen.queryByLabelText('First Name')).not.toBeInTheDocument();
    });

    it('shows driver form when driver is not same as insured', () => {
        mockUseDriverDetailsStore.mockReturnValueOnce({
            isDriverSameAsInsured: false,
            formData: initialFormData,
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn()
        });

        render(<ClaimDriverDetails />);

        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('age')).toBeInTheDocument();

    });

    it('calls updateFormData when form fields are changed', async () => {
        mockUseDriverDetailsStore.mockReturnValueOnce({
            isDriverSameAsInsured: false,
            formData: initialFormData,
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn(),
        });

        const { container } = render(<ClaimDriverDetails />);

        // Select input by name
        const firstNameInput = container.querySelector('input[name="firstName"]') as HTMLInputElement;
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        expect(mockUpdateFormData).toHaveBeenCalledWith({ firstName: 'John' });

        // Select select element by name
        const citySelect = container.querySelector('select[name="city"]') as HTMLSelectElement;
        fireEvent.change(citySelect, { target: { value: 'Addis Ababa' } });
        expect(mockUpdateFormData).toHaveBeenCalledWith({ city: 'Addis Ababa' });
    });

    it('shows error when required fields are missing and driver is different', async () => {
        mockUseDriverDetailsStore.mockReturnValueOnce({
            isDriverSameAsInsured: false,
            formData: initialFormData,
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn()
        });

        render(<ClaimDriverDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText(/All fields are required when driver is not the insured customer./i)).toBeInTheDocument();
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('navigates to next page when form is valid', async () => {
        mockUseDriverDetailsStore.mockReturnValueOnce({
            isDriverSameAsInsured: false,
            formData: {
                firstName: 'John',
                lastName: 'Doe',
                age: '30',
                city: 'Addis Ababa',
                subCity: 'Bole',
                kebele: '08',
                phoneNumber: '0912345678',
                licenseNo: 'ET123456',
                grade: '1',
                expirationDate: '2025-12-31'
            },
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn()
        });

        render(<ClaimDriverDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/accident-details');
        });
    });

    it('navigates to previous page when Previous button is clicked', async () => {
        render(<ClaimDriverDetails />);

        fireEvent.click(screen.getByText('Previous'));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/claim-disclaimer');
        });
    });

    it('navigates to next page when driver is same as insured', async () => {
        mockUseDriverDetailsStore.mockReturnValueOnce({
            isDriverSameAsInsured: true,
            formData: initialFormData,
            setDriverSame: mockSetDriverSame,
            updateFormData: mockUpdateFormData,
            clearAllData: jest.fn()
        });

        render(<ClaimDriverDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/accident-details');
        });
    });
});