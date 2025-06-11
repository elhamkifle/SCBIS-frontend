'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadIDStore } from '@/store/customerInformationStore/uploadID';
import { usePersonalDetailStore } from '@/store/customerInformationStore/personalDetails';
import { useAddressStore } from '@/store/customerInformationStore/addressStore'; 

export default function UploadIDForm() {
    const router = useRouter();
    const { files, error, setFiles, setError } = useUploadIDStore();
    const { formData: personalData } = usePersonalDetailStore();
    const { address } = useAddressStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handlePrevious = () => router.push('/policy-purchase/personal-information/address');
    
    const handleNext = async () => {
        if (files.length < 1) {
            setError('❌ Please upload an ID before proceeding.');
            return;
        }
        
        setError('');
        setIsSubmitting(true);
        
        try {
            // If files are uploaded, this counts as data modification
            // Here you would upload the files to your backend
            console.log('Uploading files:', files);
            
            logAllFormData();
            
            // Navigate to customer information preview page
            router.push('/policy-purchase/personal-information/preview');
        } catch (error) {
            console.error('Error uploading files:', error);
            setError('❌ Error uploading files. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateFile = (file: File) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            return '❌ Invalid file type. Please upload a valid National ID or Passport in PDF, JPG, or PNG format.';
        } else if (file.size > maxSize) {
            return '❌ File too large. The maximum file size allowed is 5MB.';
        }
        return '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setFiles([selectedFile]); // Replace existing file with new one
            }
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const validationError = validateFile(droppedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setFiles([droppedFile]); // Replace existing file with new one
            }
        }
    };

    const handleDeleteFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        setError('');
    };

    const logAllFormData = () => {
        console.log('=== COMPLETE FORM SUBMISSION DATA ===');
        console.log('Personal Details:', personalData);
        console.log('Address Details:', address);
        console.log('Uploaded Files:', files.map(f => ({
            name: f.name,
            type: f.type,
            size: `${(f.size / 1024 / 1024).toFixed(2)} MB`
        })));
        console.log('====================================');
    };

    // Check if we have files uploaded (this counts as data modification)
    const hasFiles = files.length > 0;

   return (
        <div className="flex items-start justify-center h-full px-4">
            <div className="w-full max-w-5xl">
                <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                    <h2 className="md:text-xl sm:text-lg font-bold mt-8">Policy Purchase</h2>
                    <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
                </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-center items-center gap-4 sm:gap-8 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-sm sm:text-base">Personal Detail</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">2</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Address</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Upload ID</span>
                </div>
            </div>

                <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl xl:p-6"
                    style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }} >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="text-black">
                            <p className="text-xl font-bold mb-4">Rule for Uploading ID</p>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Upload a clear, high-quality image or PDF of your National ID or Passport.</li>
                                <li>Ensure all text and details are clearly visible and readable.</li>
                                <li>The file size should not exceed 5MB.</li>
                                <li>Accepted formats: PDF, JPG, PNG.</li>
                                <li>Make sure the document is not expired.</li>
                                <li>Avoid uploading blurry, cropped, or damaged images.</li>
                            </ul>
                        </div>

                        <div className="text-black">
                            <p className="text-xl font-bold mb-4">Upload Your ID</p>
                            
                            {/* File Upload Area */}
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <div className="flex flex-col items-center">
                                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-lg font-medium">Drop your ID here or click to browse</p>
                                    <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>

                            <input
                                id="fileInput"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                                aria-label="Upload ID file"
                            />

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Uploaded Files Display */}
                            {files.length > 0 && (
                                <div className="mt-4">
                                    <p className="font-medium mb-2">Uploaded File:</p>
                                    {files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                                            <div className="flex items-center">
                                                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <div>
                                                    <p className="font-medium">{file.name}</p>
                                                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteFile(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                aria-label="Delete file"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="bg-[#3AA4FF] text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className={`${
                                hasFiles 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white px-6 py-2 rounded transition-colors ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Submitting...' : (hasFiles ? 'Submit' : 'Next')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
