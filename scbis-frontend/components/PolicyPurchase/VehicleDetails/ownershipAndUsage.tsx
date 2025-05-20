"use client";

import { useRouter } from 'next/navigation';
import { useOwnershipUsageStore } from '@/store/vehicleDetails/ownershipAndUsage';

export default function OwnershipAndUsageForm() {
    const router = useRouter();
    const { formData, setFormData, logFormData } = useOwnershipUsageStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        logFormData();
        router.push('/policy-purchase/vehicle-information/uploadDocs');
    };

    const handlePrevious = () => {
        router.push('/policy-purchase/vehicle-information/generalVehicleDetails');
    };

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-2 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-xs sm:text-base">Purpose</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full">2</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Vehicle Category</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">General Vehicle Details</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">4</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Ownership and Usage</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">5</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Upload Docs</span>
                </div>
            </div>

            <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl"
                style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Owner Type *</label>
                        <select name="ownerType" value={formData.ownerType} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="Individual">Individual</option>
                            <option value="Company">Company</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Driver Type *</label>
                        <select name="driverType" value={formData.driverType} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="known">Known Driver</option>
                            <option value="any">Any Driver</option>
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Seating Capacity *</label>
                        <input type="text" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Purchased Value * </label>
                        <input type="text" name="purchasedValue" value={formData.purchasedValue} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Duty-Free (Y/N) *</label>
                        <select name="dutyFree" value={formData.dutyFree} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-between mt-6">
                        <button type="button" className="bg-[#3AA4FF] text-white p-2 px-6 rounded" onClick={handlePrevious}>Previous</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 px-6 rounded">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}