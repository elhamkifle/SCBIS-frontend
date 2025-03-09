'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileX } from 'lucide-react';

export default function PurchaseRequestDeclined() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const handleNext = () => {
    if (files.length < 1) {
      setError('❌ Please upload at least one document before proceeding.');
    } else if (files.length > 3) {
      setError('❌ You can upload a maximum of 3 documents.');
    } else {
      setError('');
      router.push('/preview');
    }
  };

  const validateFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return '❌ Invalid file type. Please upload a valid document in PDF, JPG, or PNG format.';
    } else if (file.size > maxSize) {
      return '❌ File too large. The maximum file size allowed is 5MB.';
    }
    return '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const validationErrors = newFiles.map((file) => validateFile(file)).filter((error) => error);

      if (validationErrors.length > 0) {
        setError(validationErrors[0]); // Show the first validation error
      } else if (files.length + newFiles.length > 3) {
        setError('❌ You can upload a maximum of 3 documents.');
      } else {
        setError('');
        setFiles((prev) => [...prev, ...newFiles].slice(0, 3)); // Allow up to 3 files
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validationErrors = droppedFiles.map((file) => validateFile(file)).filter((error) => error);

    if (validationErrors.length > 0) {
      setError(validationErrors[0]); // Show the first validation error
    } else if (files.length + droppedFiles.length > 3) {
      setError('❌ You can upload a maximum of 3 documents.');
    } else {
      setError('');
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, 3)); // Allow up to 3 files
    }
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError('');
  };

  return (
    <div>
      <h2 className="text-2xl lg:ml-28 mb-4 font-bold">Policy Purchase</h2>

    <div
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8 lg:mb-0"
      style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      {/* Header Section */}
      <div className="text-center mb-4">
        <FileX className="text-red-500 mx-auto" size={40} />
        <h2 className="text-xl font-bold text-red-600">Policy Purchase Request Not Approved - Action Required</h2>
      </div>

      {/* Grid Layout for Reason and Upload Section */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        {/* Reason for Rejection */}
        <div>
          <h3 className="text-blue-700 font-bold">Reason for rejection:</h3>
          <p className="text-md mt-4">Your submitted documents were incomplete or incorrect.</p>
          <p className="text-md mt-2">The uploaded ID is unclear. Please re-upload a clear image.</p>
        </div>

        {/* Upload Missing or Corrected Documents */}
        <div>
          <h3 className="text-blue-700 font-bold mb-4">Upload Missing or Corrected Documents</h3>
          <div
            className="flex flex-col items-center justify-center bg-blue-100 p-8 rounded-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <p className="text-xl font-bold mb-4">Drop Files Here</p>
            <p className="text-md font-bold mb-4">Or</p>
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
              className="hidden"
              multiple // Allow multiple file uploads
            />
            <label htmlFor="file-upload" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
              Browse Files
            </label>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            {files.map((file, index) => (
              <div key={index} className="mt-2 text-green-500 text-sm">
                ✅ File ready for upload: {file.name}
                <button onClick={() => handleDeleteFile(index)} className="ml-2 text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resubmit & Cancel Buttons */}
      <div className="flex justify-between px-24 gap-4 mt-8">
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600" onClick={handleNext}>
          Resubmit
        </button>
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600">
          Cancel Request
        </button>
      </div>

      {/* Notice */}
      <p className="text-md mt-8">
        <span className="font-bold text-blue-700">N.B:</span> Your policy will become active on the day of payment after approval.
      </p>
    </div>
  </div>  
  );
}