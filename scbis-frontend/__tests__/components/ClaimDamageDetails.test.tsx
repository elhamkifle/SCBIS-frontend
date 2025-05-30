import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DamageDetails from '@/components/ClaimSubmission/damageDetails';
import { useDamageDetailsStore } from '@/store/claimSubmission/damage-details';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Mock the required dependencies
jest.mock('@/store/claimSubmission/damage-details');
jest.mock('axios');

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;


const mockAxios = axios as jest.Mocked<typeof axios>;
const mockUseDamageDetailsStore = useDamageDetailsStore as jest.MockedFunction<typeof useDamageDetailsStore>;

describe('DamageDetails', () => {
    const mockRouterPush = jest.fn();
    const mockSetError = jest.fn();
    let mockRouterBack: jest.Mock;

    const mocksetVehicleDamageDesc = jest.fn();
    const mocksetThirdPartyDamageDesc = jest.fn();
    const mocksetInjuriesAny = jest.fn();
    const mocksetInjuredPersons = jest.fn();
    const mockAddVehicleDamageFile = jest.fn();
    const mockAddThirdPartyDamageFile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseRouter.mockReturnValue({ push: mockRouterPush } as any);

        mockUseDamageDetailsStore.mockReturnValue({
            vehicleDamageDesc: '',
            thirdPartyDamageDesc: '',
            injuriesAny: false,
            injuredPersons: { name: '', address: '' },
            error: '',
            setvehicleDamageDesc: mocksetVehicleDamageDesc,
            setthirdPartyDamageDesc: mocksetThirdPartyDamageDesc,
            setinjuriesAny: mocksetInjuriesAny,
            setInjuredPersons: mocksetInjuredPersons,
            addVehicleDamageFile: mockAddVehicleDamageFile,
            addThirdPartyDamageFile: mockAddThirdPartyDamageFile,
            setError: mockSetError,
        });

        mockAxios.post.mockResolvedValue({
            status: 200,
            data: { secure_url: 'https://cloudinary.com/image.jpg' },
        });
    });

    it('renders the component with headers and progress steps', () => {
        render(<DamageDetails />);

        expect(screen.getByText('Claim Submission')).toBeInTheDocument();
        expect(screen.getByText('Save as draft')).toBeInTheDocument();
        expect(screen.getAllByText(/Details of damage to your vehicle/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Details of damage to Third Party/i).length).toBeGreaterThan(0);
    });

    it('handles vehicle damage description input', () => {
        render(<DamageDetails />);

        const textarea = screen.getAllByRole('textbox')[0];
        fireEvent.change(textarea, { target: { value: 'Front bumper damage' } });
        expect(mocksetVehicleDamageDesc).toHaveBeenCalledWith('Front bumper damage');
    });

    it('handles third party damage description input', () => {
        render(<DamageDetails />);

        const textarea = screen.getAllByRole('textbox')[1];
        fireEvent.change(textarea, { target: { value: 'Rear light broken' } });
        expect(mocksetThirdPartyDamageDesc).toHaveBeenCalledWith('Rear light broken');
    });


    it('shows injured person fields when injuries are reported', () => {
        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            injuriesAny: true,
        });

        render(<DamageDetails />);

        expect(screen.getByLabelText('Name of the Person')).toBeInTheDocument();
        expect(screen.getByLabelText('Address of the Person')).toBeInTheDocument();
    });

    it('handles injured person details input', () => {
        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            injuriesAny: true,
        });

        render(<DamageDetails />);

        fireEvent.change(screen.getByLabelText('Name of the Person'), {
            target: { value: 'John Doe' },
        });
        expect(mocksetInjuredPersons).toHaveBeenCalledWith({ name: 'John Doe' });

        fireEvent.change(screen.getByLabelText('Address of the Person'), {
            target: { value: '123 Main St' },
        });
        expect(mocksetInjuredPersons).toHaveBeenCalledWith({ address: '123 Main St' });
    });

    it('validates form before submission', async () => {
        render(<DamageDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith('Please fill at least one damage detail');
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('validates vehicle damage details', async () => {
        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            thirdPartyDamageDesc: 'Third party damage',
            injuriesAny: true,
            injuredPersons: { name: 'John', address: '123 St' },
        });

        render(<DamageDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith(
                '❌ Please upload a photo or provide a description of the damage to your vehicle.'
            );
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('validates third party damage details', async () => {
        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            vehicleDamageDesc: 'Vehicle damage',
            injuriesAny: true,
            injuredPersons: { name: 'John', address: '123 St' },
        });

        render(<DamageDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith(
                '❌ Please upload a photo or provide a description of the third-party damage.'
            );
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('validates injured person details when injuries are reported', async () => {
        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            vehicleDamageDesc: 'Vehicle damage',
            thirdPartyDamageDesc: 'Third party damage',
            injuriesAny: true,
        });

        render(<DamageDetails />);

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockSetError).toHaveBeenCalledWith(
                '❌ Please provide name and address of the injured person.'
            );
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });

    it('uploads files and navigates on successful submission', async () => {
        const vehicleFile = new File(['vehicle'], 'vehicle.jpg', { type: 'image/jpeg' });
        const thirdPartyFile = new File(['thirdparty'], 'thirdparty.jpg', { type: 'image/jpeg' });

        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            vehicleDamageDesc: 'Vehicle damage',
            thirdPartyDamageDesc: 'Third party damage',
            injuriesAny: false,
        });

        render(<DamageDetails />);

        const vehicleInput = screen.getAllByLabelText(/Browse Files/i)[0];
        fireEvent.change(vehicleInput, { target: { files: [vehicleFile] } });

        const thirdPartyInput = screen.getAllByLabelText(/Browse Files/i)[1];
        fireEvent.change(thirdPartyInput, { target: { files: [thirdPartyFile] } });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledTimes(2);
            expect(mockAddVehicleDamageFile).toHaveBeenCalledWith('https://cloudinary.com/image.jpg');
            expect(mockAddThirdPartyDamageFile).toHaveBeenCalledWith('https://cloudinary.com/image.jpg');
            expect(mockRouterPush).toHaveBeenCalledWith('/claim-submission/declaration');
        });
    });

    it('handles file upload errors', async () => {
        mockAxios.post.mockRejectedValueOnce(new Error('Upload failed'));

        const vehicleFile = new File(['vehicle'], 'vehicle.jpg', { type: 'image/jpeg' });

        mockUseDamageDetailsStore.mockReturnValueOnce({
            ...mockUseDamageDetailsStore(),
            vehicleDamageDesc: 'Vehicle damage',
            thirdPartyDamageDesc: 'Third party damage',
            injuriesAny: false,
        });

        render(<DamageDetails />);

        const vehicleInput = screen.getAllByLabelText(/Browse Files/i)[0];
        fireEvent.change(vehicleInput, { target: { files: [vehicleFile] } });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(mockRouterPush).not.toHaveBeenCalled();
        });
    });


});
