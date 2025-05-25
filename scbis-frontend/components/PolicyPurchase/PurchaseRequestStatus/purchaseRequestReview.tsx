'use client';

import { Car  } from 'lucide-react';

export default function PurchaseRequestReview() {
  return (

    <>
      <h2 className="text-2xl lg:ml-28 mb-4 font-bold">Policy Purchase</h2>

    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-[#DBBF1F] mb-4">Policy Purchase Request is Under Review</h2>
        <p className="text-blue-600 font-semibold mb-4">
          Status: <span className="text-[#DBBF1F] ">Pending Admin Approval </span>
        </p>

        <p className="text-blue-600">
          Estimated Approval Time: <span className="text-black">Typically within 24 hours( work day ) </span>
        </p>
      </div>

      {/* Vehicle & Policy Details */}
      <div className="pb-4 mb:8 md:mb-24 px-16">
        <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold">
          <Car size={20} />
          <h3 className='text-lg'>Submitted Vehicle & Policy Details:</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-md">
          <p><strong>Vehicle Type:</strong> Toyota Corolla 2021</p>
          <p><strong>Plate Number:</strong> Code 2 - A12345</p>
          <p><strong>Insurance Type:</strong> Comprehensive Cover</p>
          <p><strong>Policy Duration:</strong> 1 Year</p>
        </div>
      </div>




      {/* Notice */}
      <p className="text-md mt-8">
        <span className="font-bold text-blue-700">N.B:</span> Your policy will become active on the day of payment after approval.
      </p>
    </div></>
      



  );
}
