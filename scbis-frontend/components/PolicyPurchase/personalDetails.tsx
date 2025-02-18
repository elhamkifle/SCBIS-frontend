"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalDetailForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        nationality: '',
        email: '',
        phone: '',
        tin: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        router.push('/address');
    };

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
                <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-center items-center gap-4 sm:gap-8 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#1F4878] text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-sm sm:text-base">Personal Detail</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full">2</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Address</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Upload ID</span>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white p-8 pb-4 rounded-xl shadow-lg w-full max-w-5xl lg:min-h-[400px] xl:min-h-[450px]">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-gray-700">Title *</label>
                        <select name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">First Name *</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Last Name *</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Date Of Birth *</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Nationality</label>
                        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Additional Phone No.</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700">TIN No.</label>
                        <input type="text" name="tin" value={formData.tin} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
