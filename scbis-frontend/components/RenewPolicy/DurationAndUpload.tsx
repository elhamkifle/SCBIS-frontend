'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useRenewalFormStore } from '@/store/renewalStore/useRenewalForm';

export default function RenewalDetailsPage() {
    const { durationInMonths, licenseFileUrl, setDuration, setLicenseFileUrl } = useRenewalFormStore();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { policyId } = useParams();

    const handleUpload = async () => {
        if (!file) return null;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'docuploads');

        try {
            const res = await axios.post('https://api.cloudinary.com/v1_1/dmzvqehan/upload', formData);
            return res.data.secure_url;
        } catch (err) {
            console.error('Upload error:', err);
            setError('❌ Upload failed.');
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!durationInMonths || !file) {
            return setError('Please select duration and upload your driver’s license.');
        }

        setError('');
        setLoading(true);

        const licenseUrl = await handleUpload();
        if (!licenseUrl) {
            setLoading(false);
            return;
        }

        setLicenseFileUrl(licenseUrl);

        try {
            //TODO: Finish these things up. 
            const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
            
            await axios.patch(`/api/policies/${policyId}`, {
                status: 'pending',
                isRenewal: true,
                renewalDuration: durationInMonths,
                licenseUrl,
            });

            alert("Policy Renewal Submitted Successfully. Please await further instructions.")

            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to submit renewal:', err);
            setError('❌ Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Renew Policy</h1>

            <div>
                <label className="block font-semibold">Select Duration (Months)</label>
                <select
                    className="border p-2 rounded w-full mt-1"
                    value={durationInMonths}
                    onChange={(e) => setDuration(Number(e.target.value))}
                >
                    <option value={0}>-- Select --</option>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>12 months</option>
                </select>
            </div>

            <div>
                <label className="block font-semibold">Upload Driver’s License</label>
                <input
                    type="file"
                    accept="image/*,.pdf"
                    className="block mt-2"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Renewal Request'}
            </button>
        </div>
    );
}
