'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
    message: string;
    type: SnackbarType;
    isOpen: boolean;
    onClose: () => void;
    duration?: number;
}

const Snackbar = ({ message, type, isOpen, onClose, duration = 5000 }: SnackbarProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-yellow-500" />;
            case 'info':
                return <Info size={20} className="text-blue-500" />;
            default:
                return <Info size={20} className="text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'info':
                return 'text-blue-800';
            default:
                return 'text-blue-800';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div
                className={`
          ${getBackgroundColor()}
          ${getTextColor()}
          border rounded-lg shadow-lg p-4 max-w-sm w-full
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
            >
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onClose, 300);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Snackbar; 