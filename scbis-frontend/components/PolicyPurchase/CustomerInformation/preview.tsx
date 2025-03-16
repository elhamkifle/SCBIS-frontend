'use client';

import { useState } from 'react';
import { Edit, Check } from 'lucide-react';

export default function EditableForm() {
  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: 'John Doe',
    lastName: 'Robert',
    gender: 'Male',
    address: '',
  });

  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    address: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (section: 'personalInfo' | 'address') => {
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div>
    <h2 className="text-2xl lg:ml-16 mb-4 font-bold">Preview</h2>

    <div className="max-w-5xl mx-auto p-6 px-12 bg-white shadow-lg rounded-lg">
      {/* Personal Information */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">Personal Information</h2>
          <button onClick={() => toggleEdit('personalInfo')} className="text-blue-500">
            {isEditing.personalInfo ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.personalInfo ? (
          <div className="grid grid-cols-2 gap-4 mt-2 p-2 px-8 border rounded-lg">
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="border p-2 rounded w-full" />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border p-2 rounded w-full" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border p-2 rounded w-full" />
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-2 px-8">
            <p><strong>Title:</strong> {formData.title}</p>
            <p><strong>First Name:</strong> {formData.firstName}</p>
            <p><strong>Last Name:</strong> {formData.lastName}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
          </div>
        )}
      </div>

      {/* Address Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">Address</h2>
          <button onClick={() => toggleEdit('address')} className="text-blue-500">
            {isEditing.address ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.address ? (
          <textarea name="address" value={formData.address} onChange={handleChange} className="border p-2 w-full rounded mt-2" />
        ) : (
          <p className="mt-2">{formData.address || 'No address provided'}</p>
        )}
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Submit</button>
    </div>

    </div>
  );
}
