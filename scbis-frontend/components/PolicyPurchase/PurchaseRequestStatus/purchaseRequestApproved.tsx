'use client';

import { CheckCircle, Car, Calculator } from 'lucide-react';

export default function PurchaseRequestApproved() {
  return (

    <>
      <h2 className="text-2xl lg:ml-28 mb-4 font-bold">Policy Purchase</h2>

    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {/* Header Section */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <CheckCircle className="text-green-500" size={40} />
          <div>
            <h2 className="text-xl font-bold text-green-600">Policy Purchase Request is Approved</h2>
          </div>          
    </div>

    <div className="flex items-center justify-center gap-2 mb-8"> 
    <p className="text-blue-600 font-semibold font-syne">
      Status: <span className="text-green-500">Approved - Pending Payment</span>
    </p>
    </div>

      {/* Vehicle & Policy Details */}
      <div className="pb-4 mb-4 px-16">
        <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold font-syne">
          <Car size={20} />
          <h3 className='text-lg'>Vehicle & Policy Details:</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-md">
          <p><strong>Vehicle Type:</strong> Toyota Corolla 2021</p>
          <p><strong>Plate Number:</strong> Code 2 - A12345</p>
          <p><strong>Insurance Type:</strong> Comprehensive Cover</p>
          <p><strong>Policy Duration:</strong> 1 Year</p>
        </div>
      </div>

      {/* Premium Calculation */}
      <div className="pb-4 mb-4 px-16">
        <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold font-syne">
          <Calculator size={20} />
          <h3 className='text-lg'>Premium Calculation:</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-md">
          <p><strong>Premium Amount:</strong> ETB 25,000</p>
          <p><strong>Duration:</strong> 1 Year</p>
        </div>
      </div>

      {/* Accept & Reject Buttons */}
      <div className="flex justify-between px-24 gap-4 mt-4">
        <button className="bg-green-500 text-white px-12 py-2 rounded-lg shadow hover:bg-green-600">
          Accept
        </button>
        <button className="bg-red-500 text-white px-12 py-2 rounded-lg shadow hover:bg-red-600">
          Reject
        </button>
      </div>

      {/* Notice */}
      <p className="text-md mt-8">
        <span className="font-bold text-blue-700">N.B:</span> Your policy will become active on the day of payment after approval.
      </p>
    </div></>
      



  );
}
