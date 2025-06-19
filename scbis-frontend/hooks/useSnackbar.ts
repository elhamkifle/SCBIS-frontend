import { useState } from 'react';
import { SnackbarType } from '@/components/ui/Snackbar';

interface SnackbarState {
    isOpen: boolean;
    message: string;
    type: SnackbarType;
}

export const useSnackbar = () => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        isOpen: false,
        message: '',
        type: 'info'
    });

    const showSnackbar = (message: string, type: SnackbarType = 'info') => {
        setSnackbar({
            isOpen: true,
            message,
            type
        });
    };

    const hideSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            isOpen: false
        }));
    };

    const showSuccess = (message: string) => showSnackbar(message, 'success');
    const showError = (message: string) => showSnackbar(message, 'error');
    const showWarning = (message: string) => showSnackbar(message, 'warning');
    const showInfo = (message: string) => showSnackbar(message, 'info');

    return {
        snackbar,
        showSnackbar,
        hideSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
}; 