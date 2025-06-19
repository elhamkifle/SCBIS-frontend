'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVehiclePurposeStore } from '@/store/vehicleDetails/purpose';
import { useVehicleDocumentsStore } from '@/store/vehicleDetails/vehicleDocuments';
import { useVehicleSelectionStore } from '@/store/vehicleSelection/vehicleSelectionStore';
import axios from 'axios';

export default function UploadIDForm() {
    const router = useRouter();
    const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
    const [vehicleLibreFile, setVehicleLibreFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [hasAutoFilled, setHasAutoFilled] = useState(false);
    const [manuallyCleared, setManuallyCleared] = useState({ driversLicense: false, vehicleLibre: false });
    const { selectedType } = useVehiclePurposeStore();
    const { setDriversLicense, setVehicleLibre, driversLicense, vehicleLibre } = useVehicleDocumentsStore();
    const { isExistingVehicle, vehicleData } = useVehicleSelectionStore();

    // Auto-fill documents from existing vehicle data on component mount
    useEffect(() => {
        console.log('🔍 Checking for existing vehicle documents...');
        console.log('📋 Vehicle selection state:', { isExistingVehicle, vehicleData });

        if (isExistingVehicle && vehicleData && !hasAutoFilled) {
            console.log('✅ Loading existing vehicle documents');

            let documents;

            // Handle both private and commercial vehicles
            if (vehicleData.privateVehicle?.documents) {
                documents = vehicleData.privateVehicle.documents;
            } else if (vehicleData.commercialVehicle?.documents) {
                documents = vehicleData.commercialVehicle.documents;
            }

            if (documents) {
                // Auto-fill the document store with existing URLs only if not manually cleared
                if (documents.driversLicense && !driversLicense && !manuallyCleared.driversLicense) {
                    setDriversLicense(documents.driversLicense);
                    console.log('✅ Auto-filled driver\'s license:', documents.driversLicense);
                }

                if (documents.vehicleLibre && !vehicleLibre && !manuallyCleared.vehicleLibre) {
                    setVehicleLibre(documents.vehicleLibre);
                    console.log('✅ Auto-filled vehicle libre:', documents.vehicleLibre);
                }
            }

            // Mark as auto-filled to prevent running again
            setHasAutoFilled(true);
        } else if (!isExistingVehicle) {
            console.log('🆕 New vehicle - no existing documents to load');
            setHasAutoFilled(true); // Prevent auto-fill for new vehicles
        }
    }, [isExistingVehicle, vehicleData, hasAutoFilled]); // Removed driversLicense and vehicleLibre from dependencies

    const handlePrevious = () => router.push('/policy-purchase/vehicle-information/ownershipAndUsage');

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'docuploads'); // Make sure this preset exists in your Cloudinary

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dmzvqehan/upload', // Replace with your cloud name
                formData
            );
            if (response.status === 200) {
                return response.data.secure_url;
            }
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Failed to upload file');
        }
        return null;
    };

    const handleNext = async () => {
        // Check if both documents are provided (either already uploaded or new files)
        if (!driverLicenseFile && !driversLicense) {
            setError('❌ Please upload your driver\'s license.');
            return;
        }

        if (!vehicleLibreFile && !vehicleLibre) {
            setError('❌ Please upload your vehicle libre document.');
            return;
        }

        setError('');
        setIsUploading(true);

        try {
            // Upload driver's license if new file provided
            if (driverLicenseFile) {
                console.log('Uploading driver\'s license...');
                const driverLicenseUrl = await uploadToCloudinary(driverLicenseFile);
                if (driverLicenseUrl) {
                    setDriversLicense(driverLicenseUrl);
                    console.log('✅ Driver\'s license uploaded:', driverLicenseUrl);
                } else {
                    throw new Error('Failed to upload driver\'s license');
                }
            }

            // Upload vehicle libre if new file provided
            if (vehicleLibreFile) {
                console.log('Uploading vehicle libre...');
                const vehicleLibreUrl = await uploadToCloudinary(vehicleLibreFile);
                if (vehicleLibreUrl) {
                    setVehicleLibre(vehicleLibreUrl);
                    console.log('✅ Vehicle libre uploaded:', vehicleLibreUrl);
                } else {
                    throw new Error('Failed to upload vehicle libre');
                }
            }

            console.log('✅ All documents processed successfully');

            // Navigate to preview page
            const type = selectedType?.toLowerCase();
            if (type === 'commercial') {
                router.push('/policy-purchase/vehicle-information/commercialVehiclePreview');
            } else {
                router.push('/policy-purchase/vehicle-information/preview');
            }

        } catch (error) {
            console.error('Upload error:', error);
            setError('❌ Failed to upload documents. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const validateFile = (file: File) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            return '❌ Invalid file type. Please upload a valid document in PDF, JPG, or PNG format.';
        } else if (file.size > maxSize) {
            return '❌ File too large. The maximum file size allowed is 5MB.';
        }
        return '';
    };

    const handleDriverLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setDriverLicenseFile(selectedFile);
            }
        }
    };

    const handleVehicleLibreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setVehicleLibreFile(selectedFile);
            }
        }
    };

    const handleDriverLicenseDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const validationError = validateFile(droppedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setDriverLicenseFile(droppedFile);
            }
        }
    };

    const handleVehicleLibreDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const validationError = validateFile(droppedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setVehicleLibreFile(droppedFile);
            }
        }
    };

    const handleDeleteDriversLicense = () => {
        setDriversLicense(null);
        setDriverLicenseFile(null);
        setError('');
        console.log('🗑️ Cleared driver\'s license for replacement');
        setManuallyCleared(prev => ({ ...prev, driversLicense: true }));
    };

    const handleDeleteVehicleLibre = () => {
        setVehicleLibre(null);
        setVehicleLibreFile(null);
        setError('');
        console.log('🗑️ Cleared vehicle libre for replacement');
        setManuallyCleared(prev => ({ ...prev, vehicleLibre: true }));
    };

    const handleDeleteDriverLicenseFile = () => {
        setDriverLicenseFile(null);
        setError('');
    };

    const handleDeleteVehicleLibreFile = () => {
        setVehicleLibreFile(null);
        setError('');
    };

    return (
        <div className="flex items-start justify-center h-full px-4">
            <div className="w-full max-w-5xl">
                <div className="flex justify-between items-center">
                    <h2 className="md:text-xl sm:text-lg font-bold mt-8">Policy Purchase</h2>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-2 mt-6 mb-4">
                    {['Purpose', 'Vehicle Category', 'General Vehicle Details', 'Ownership and Usage', 'Upload Docs'].map((label, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center">
                                <div className={`w-7 h-7 flex items-center justify-center ${i === 4 ? 'bg-[#1F4878]' : 'bg-green-500'} text-white rounded-full`}>{i + 1}</div>
                                <span className="ml-2 font-medium text-black text-xs sm:text-base">{label}</span>
                            </div>
                            {i !== 4 && <div className="w-7 sm:border-t-2 border-gray-400" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Upload Box */}
                <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl xl:p-6"
                    style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>

                    {/* Rules Section */}
                    <div className="mb-6">
                        <div className="text-black">
                            <p className="text-xl font-bold mb-4">Rules for Uploading Driver&apos;s License and Vehicle Libre</p>
                            {[
                                '✅ Required Documents: Driver&apos;s License and Vehicle Libre (Registration) are mandatory.',
                                '✅ File Format: Only PDF, JPG, PNG files are allowed.',
                                '✅ File Size Limit: Maximum 5MB per file.',
                                '✅ Image Clarity: Documents must be clear, unedited, and all text must be readable.',
                                '✅ Validity: Documents must be valid (not expired).',
                                '✅ Name Match: Driver&apos;s license name should match the policy holder name.'
                            ].map((rule, idx) => <p key={idx} className="mb-1 text-sm">{rule}</p>)}
                        </div>
                    </div>

                    {/* Two Upload Areas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Driver's License Upload */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-center">Driver&apos;s License</h3>

                            {/* Show existing document if available and no new file is selected */}
                            {driversLicense && !driverLicenseFile ? (
                                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={driversLicense}
                                                alt="Driver's License"
                                                className="w-32 h-24 object-cover rounded-lg border shadow-sm"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                            {/* Fallback for non-image files (PDFs) */}
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg border shadow-sm items-center justify-center hidden flex-col">
                                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs mt-1">PDF</p>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="font-medium text-green-700">Driver&apos;s License</p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Successfully uploaded</p>
                                            <div className="flex space-x-3 mt-2">
                                                <a
                                                    href={driversLicense}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Full Size
                                                </a>
                                                <button
                                                    onClick={handleDeleteDriversLicense}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Replace
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center bg-blue-100 p-6 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors cursor-pointer"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDriverLicenseDrop}
                                    onClick={() => document.getElementById('driver-license-upload')?.click()}
                                >
                                    <p className='text-lg font-bold mb-2'>Drop License Here</p>
                                    <p className='text-md font-bold mb-4'>Or</p>
                                    <input
                                        type="file"
                                        id="driver-license-upload"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handleDriverLicenseChange}
                                        className="hidden"
                                        aria-label="Upload driver license file"
                                    />
                                    <button
                                        type="button"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        aria-label="Browse for driver license file"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            document.getElementById('driver-license-upload')?.click();
                                        }}
                                    >
                                        Browse Files
                                    </button>

                                    {/* Show new file selected */}
                                    {driverLicenseFile && (
                                        <div className="mt-4 w-full">
                                            <div className="flex items-center justify-between p-3 bg-white rounded border-2 border-blue-300">
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="font-medium text-sm">{driverLicenseFile.name}</p>
                                                        <p className="text-xs text-gray-500">{(driverLicenseFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleDeleteDriverLicenseFile}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete driver license file"
                                                    aria-label="Delete driver license file"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Vehicle Libre Upload */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-center">Vehicle Libre (Registration)</h3>

                            {/* Show existing document if available and no new file is selected */}
                            {vehicleLibre && !vehicleLibreFile ? (
                                <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={vehicleLibre}
                                                alt="Vehicle Libre"
                                                className="w-32 h-24 object-cover rounded-lg border shadow-sm"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                            {/* Fallback for non-image files (PDFs) */}
                                            <div className="w-32 h-24 bg-gray-100 rounded-lg border shadow-sm items-center justify-center hidden flex-col">
                                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-xs mt-1">PDF</p>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="font-medium text-green-700">Vehicle Libre</p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Successfully uploaded</p>
                                            <div className="flex space-x-3 mt-2">
                                                <a
                                                    href={vehicleLibre}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Full Size
                                                </a>
                                                <button
                                                    onClick={handleDeleteVehicleLibre}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Replace
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center bg-green-100 p-6 rounded-lg border-2 border-dashed border-green-300 hover:border-green-500 transition-colors cursor-pointer"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleVehicleLibreDrop}
                                    onClick={() => document.getElementById('vehicle-libre-upload')?.click()}
                                >
                                    <p className='text-lg font-bold mb-2'>Drop Libre Here</p>
                                    <p className='text-md font-bold mb-4'>Or</p>
                                    <input
                                        type="file"
                                        id="vehicle-libre-upload"
                                        accept=".pdf,.jpg,.png"
                                        onChange={handleVehicleLibreChange}
                                        className="hidden"
                                        aria-label="Upload vehicle libre file"
                                    />
                                    <button
                                        type="button"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        aria-label="Browse for vehicle libre file"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            document.getElementById('vehicle-libre-upload')?.click();
                                        }}
                                    >
                                        Browse Files
                                    </button>

                                    {/* Show new file selected */}
                                    {vehicleLibreFile && (
                                        <div className="mt-4 w-full">
                                            <div className="flex items-center justify-between p-3 bg-white rounded border-2 border-green-300">
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="font-medium text-sm">{vehicleLibreFile.name}</p>
                                                        <p className="text-xs text-gray-500">{(vehicleLibreFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleDeleteVehicleLibreFile}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete vehicle libre file"
                                                    aria-label="Delete vehicle libre file"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="bg-[#3AA4FF] text-white p-7 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isUploading}
                            className={`bg-blue-500 text-white p-10 py-2 rounded transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                        >
                            {isUploading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) :
                                'Next'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
