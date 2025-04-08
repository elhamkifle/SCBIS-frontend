'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  driverFullName: string;
  insuredFullName: string;
  signatureDate: string;
  acceptTerms: boolean;
}

interface Errors {
  driverFullName?: string;
  insuredFullName?: string;
  signatureDate?: string;
  acceptTerms?: string;
}

export default function Declaration() {
  const [formData, setFormData] = useState<FormData>({
    driverFullName: '',
    insuredFullName: '',
    signatureDate: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const handlePrevious = () => {
    router.push('/policy-purchase/purchase/vehicleInformation');
  };

  const handleNext = () => {
    const newErrors: Errors = {};
    if (!formData.driverFullName) newErrors.driverFullName = 'Driver\'s Full Name is required';
    if (!formData.insuredFullName) newErrors.insuredFullName = 'Insured\'s Full Name is required';
    if (!formData.signatureDate) newErrors.signatureDate = 'Date is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms to continue';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.push('/preview');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 rounded-lg">
      <div className="w-full flex justify-between items-center mt-2">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
          Save as draft
        </button>
      </div>

      <div className="mt-8 mb-8">
        <label className="font-bold">Declaration:</label>
        <p className="mb-8">
          I/We declare the foregoing particulars to be true and correct in every respect, and undertake
          to render the Company every assistance in my/our power in dealing with the matter.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-24 mt-4">
          <div className="flex-1">
            <label className="block text-md font-medium text-black mb-2">Driver's Full Name</label>
            <input
              type="text"
              name="driverFullName"
              className="w-full border py-2 border-white border-b-black"
              onChange={handleChange}
            />
            {errors.driverFullName && <p className="text-red-500">{errors.driverFullName}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-md font-medium text-black mb-2">Insured's Full Name</label>
            <input
              type="text"
              name="insuredFullName"
              className="w-full border py-2 border-white border-b-black"
              onChange={handleChange}
            />
            {errors.insuredFullName && <p className="text-red-500">{errors.insuredFullName}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-md font-medium text-black mb-2">Date</label>
            <input
              type="date"
              name="signatureDate"
              className="w-full border py-2 border-white border-b-black"
              onChange={handleChange}
            />
            {errors.signatureDate && <p className="text-red-500">{errors.signatureDate}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              name="acceptTerms"
              onChange={handleChange}
              checked={formData.acceptTerms}
            />{' '}
            I Accept and Continue
          </label>
          {errors.acceptTerms && <p className="text-red-500">{errors.acceptTerms}</p>}
        </div>
      </div>

      <div className="w-full max-w-5xl flex justify-between items-center mt-8">
        <button
          type="button"
          className="bg-[#3AA4FF] text-white p-7 py-2 rounded"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
