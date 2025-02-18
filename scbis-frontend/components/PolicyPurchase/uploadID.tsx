'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadIDForm() {

    const router = useRouter();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleNext(); // Move to the next step after submitting
    };

    // Navigate to the previous step
    const handlePrevious = () => {
        router.push('/address');
    };

    // Navigate to the next step
    const handleNext = () => {
        router.push('/preview');
    };

    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            const maxSize = 5 * 1024 * 1024;

            if (!allowedTypes.includes(selectedFile.type)) {
                setError('❌ Invalid file type. Please upload a valid National ID or Passport in PDF, JPG, or PNG format.');
                setFile(null);
            } else if (selectedFile.size > maxSize) {
                setError('❌ File too large. The maximum file size allowed is 5MB.');
                setFile(null);
            } else {
                setError('');
                setFile(selectedFile);
            }
        }
    };

    const handleDeleteFile = () => {
        setFile(null);
        setError('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl relative">
                <button type="button" className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded">Save as draft</button>
                <h2 className="text-2xl font-bold mb-4 text-left">Policy Purchase</h2>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:pl-8 md:pl-12 md:pr-12 mb-6 w-full">
                    {['Personal Detail', 'Address', 'Upload ID'].map((label, index) => (
                        <div key={index} className="relative z-10 flex items-center self-start sm:self-auto w-full sm:w-auto">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 2 ? 'bg-green-500' : 'bg-blue-600'} text-white`}>{index + 1}</div>
                            <span className="ml-2 font-medium text-black text-sm md:text-base">{label}</span>
                            {index < 2 && <div className="w-48 sm:w-24 h-px bg-black hidden sm:block ml-4" />}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 pl-8 text-gray-700">
                        <p className="text-2xl font-bold mb-8"> Rules for uploading ID: </p>
                        {[
                            '✅ Allowed Document Types: Only Kebele ID, National ID or Passport are accepted.',
                            '✅ File Format: Only PDF, JPG, PNG files are allowed.',
                            '✅ File Size Limit: Maximum 5MB per file.',
                            '✅ Image Clarity: The ID must be clear, unedited, and all text must be readable.'
                        ].map((rule, idx) => <p key={idx}>{rule}</p>)}
                    </div>

                    <div className="flex flex-col justify-center w-full md:w-1/2 md:pt-16 md:pb-16 mt-8 md:mt-0 bg-blue-100 p-6 rounded-lg">
                        <div className="text-center text-black mb-4">
                            <p className='md:text-3xl text-lg font-bold'>Drop files here</p>
                            <p className='md:text-2xl text-md font-bold'>or</p>
                        </div>

                        <input
                            type="file"
                            id="file-upload"
                            accept=".pdf,.jpg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <div className="flex justify-center w-full">
                            <label
                                htmlFor="file-upload"
                                className="w-1/2 p-3 text-white bg-green-500 text-center rounded cursor-pointer hover:bg-green-600"
                            >
                                Browse Files
                            </label>
                        </div>

                        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                        {file && (
                            <div className="mt-2 text-green-500 text-sm">
                                ✅ File ready for upload: {file.name}
                                <button
                                    type="button"
                                    onClick={handleDeleteFile}
                                    className="ml-4 text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete File
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePrevious}>Previous</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleNext}>Preview</button>
                </div>
            </div>
        </div>
    );
}
