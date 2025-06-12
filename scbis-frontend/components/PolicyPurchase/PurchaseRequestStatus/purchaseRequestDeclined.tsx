'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FileX } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { usePoliciesStore } from '@/store/dashboard/policies';

interface Vehicle {
  _id: string;
  vehicleType: 'Private' | 'Commercial';
  privateVehicle?: {
    documents: {
      driversLicense?: string;
      vehicleLibre?: string;
    };
  };
  commercialVehicle?: {
    documents: {
      driversLicense?: string;
      vehicleLibre?: string;
    };
  };
}

interface Policy {
  _id: string;
  status?: {
    value: string;
  };
  statusReason?: string;
  vehicleId?: string;
}

export default function PurchaseRequestDeclined() {
  const router = useRouter();
  const params = useParams();
  const policyId = params?.id as string;
  const [error, setError] = useState<string>('');
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { policies } = usePoliciesStore();

  const [driversLicenseFile, setDriversLicenseFile] = useState<File | null>(null);
  const [vehicleLibreFile, setVehicleLibreFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPolicyAndVehicle = async () => {
      try {
        setLoading(true);
        const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];

        const policyRes = await axios.get<Policy>(
          `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/policy-details/${policyId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setPolicy(policyRes.data);

        if (policyRes.data?.vehicleId) {
          const vehicleRes = await axios.get<Vehicle>(
            `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/vehicle-details/${policyRes.data.vehicleId}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          setVehicle(vehicleRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load policy details');
      } finally {
        setLoading(false);
      }
    };

    if (policyId) fetchPolicyAndVehicle();
  }, [policyId, policies]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('upload_preset', 'docuploads');

    const result = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/dmzvqehan/upload`,
      formdata
    );

    if (result.statusText === "OK") {
      return result.data.secure_url;
    }
    throw new Error('Upload failed');
  };

  const updateVehicleDocuments = async (
    docType: 'driversLicense' | 'vehicleLibre',
    url: string
  ): Promise<void> => {
    if (!vehicle?._id) throw new Error('No vehicle ID available');
    
    const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
    const path = vehicle.vehicleType === 'Private' ? 'privateVehicle' : 'commercialVehicle';
    
    await axios.put(
      `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/update-vehicle/${vehicle._id}`,
      {
        [`${path}.documents.${docType}`]: url
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  };

  const updatePolicyStatus = async (status: string): Promise<void> => {
    if (!policy?._id) throw new Error('No policy ID available');
    
    const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
    if (!accessToken) throw new Error('No access token found');

    await axios.put(
      `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/update-policy-status/${policy._id}`,
      { status: "pending" },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setError('');

      // First update policy status to "pending"
      await updatePolicyStatus('pending');

      // Check which documents need to be uploaded
      const needsLicense = policy?.statusReason?.toLowerCase().includes('license');
      const needsLibre = policy?.statusReason?.toLowerCase().includes('libre');

      // Upload documents
      if (needsLicense && driversLicenseFile) {
        const licenseUrl = await uploadToCloudinary(driversLicenseFile);
        await updateVehicleDocuments('driversLicense', licenseUrl);
      }

      if (needsLibre && vehicleLibreFile) {
        const libreUrl = await uploadToCloudinary(vehicleLibreFile);
        await updateVehicleDocuments('vehicleLibre', libreUrl);
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting documents:', err);
      const error = err as Error | AxiosError;
      setError(error.message || 'Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const validateFile = (file: File): string => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, JPG, or PNG.';
    }
    if (file.size > maxSize) {
      return 'File too large. Maximum size is 5MB.';
    }
    return '';
  };

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
      } else {
        setError('');
        setDriversLicenseFile(file);
      }
    }
  };

  const handleLibreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
      } else {
        setError('');
        setVehicleLibreFile(file);
      }
    }
  };

  const removeLicense = () => setDriversLicenseFile(null);
  const removeLibre = () => setVehicleLibreFile(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-lg">Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-lg">Failed to load policy details</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Determine which documents are needed based on status reason
  const needsLicense = policy?.statusReason?.toLowerCase().includes('license');
  const needsLibre = policy?.statusReason?.toLowerCase().includes('libre');

  return (
    <div>
      <h2 className="text-2xl lg:ml-28 mb-4 font-bold">Policy Purchase</h2>

      <div
        className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8 lg:mb-0"
        style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <FileX className="text-red-500" size={40} />
          <div>
            <h2 className="text-xl font-bold text-red-600">Policy Purchase Request Not Approved – Action Required</h2>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-blue-700 font-bold">Your policy has been put on hold for the following reasons:</h3>
            <p className="text-md mt-4 whitespace-pre-line">{policy.statusReason}</p>
          </div>

          <div>
            <h3 className="text-blue-700 font-bold mb-4">Upload Missing or Corrected Documents</h3>

            {/* Drivers License Upload Section */}
            {needsLicense && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Driver's License</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  {driversLicenseFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">{driversLicenseFile.name}</span>
                      <button
                        onClick={removeLicense}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="license-upload"
                        accept=".pdf,.jpg,.png"
                        onChange={handleLicenseUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="license-upload"
                        className="block bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 text-center"
                      >
                        Upload Driver's License
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Vehicle Libre Upload Section */}
            {needsLibre && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Vehicle Libre</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  {vehicleLibreFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">{vehicleLibreFile.name}</span>
                      <button
                        onClick={removeLibre}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        id="libre-upload"
                        accept=".pdf,.jpg,.png"
                        onChange={handleLibreUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="libre-upload"
                        className="block bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 text-center"
                      >
                        Upload Vehicle Libre
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        <div className="flex justify-between px-24 gap-4 mt-8">
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600" onClick={()=>router.push('/dashboard')}>
            Back to Dashboard
          </button>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={uploading ||
              (needsLicense && !driversLicenseFile) ||
              (needsLibre && !vehicleLibreFile)}
          >
            {uploading ? 'Uploading...' : 'Resubmit'}
          </button>

        </div>

        <p className="lg:text-lg mt-8 font-syne">
          <span className="font-bold text-blue-700">N.B:</span> Your policy will become active on the day of payment after approval.
        </p>
      </div>
    </div>
  );
}