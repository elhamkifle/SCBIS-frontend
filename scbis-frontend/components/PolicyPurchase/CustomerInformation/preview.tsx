'use client';
import { useEffect, useState } from 'react';
import { Edit, Check } from 'lucide-react';
import { usePersonalDetailStore } from '@/store/customerInformationStore/personalDetails';
import { useAddressStore } from '@/store/customerInformationStore/addressStore';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/authStore/useUserStore';
import { fetchUserData, updateUserData } from '@/utils/userUtils';
// import { baseAPI } from '@/utils/axiosInstance';
// import { set } from 'zod';
// import { span } from 'framer-motion/client';

export default function Preview() {
  const user = useUserStore((state) => state.user);
  // const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();
  const { formData: personalData, resetForm } = usePersonalDetailStore();
  const { address: addressData, resetAddress } = useAddressStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    email: '',
    phone: '',
    tin: '',

    // Address Information
    country: '',
    state: '',
    city: '',
    subcity: '',
    zone: '',
    wereda: '',
    kebele: '',
    houseNo: '',

    // File Upload
    idFile: null as File | null,
  });

  // Fetch latest user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        await fetchUserData();
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load the latest user data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      loadUserData();
    }
  }, []);

  // Merge personal data and address data into the state
  useEffect(() => {
    // Get any existing user data we might want to include
    const userData = user ? {
      // Map user fields to form fields when form data is empty
      email: personalData.email || user.email || '',
      phone: personalData.phone || user.phoneNumber || '',
      // Extract any additional fields
      ...(user.city && { city: addressData.city || user.city || '' }),
      ...(user.country && { country: addressData.country || user.country || '' }),
      ...(user.subcity && { subcity: addressData.subcity || user.subcity || '' }),
      ...(user.zone && { zone: addressData.zone || user.zone || '' }),
      ...(user.kebele && { kebele: addressData.kebele || user.kebele || '' }),
    } : {};

    // Merge all data sources with priority: personalData/addressData > userData > current formData
    setFormData((prev) => ({
      ...prev,
      ...userData,
      ...addressData,
      ...personalData
    }));
  }, [personalData, addressData, user]);

  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    address: false,
  });

  // Handle change in form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFormData((prev) => ({ ...prev, idFile: e.target.files![0] }));
  //   }
  // };

  // Toggle edit state for personal or address info
  const toggleEdit = (section: 'personalInfo' | 'address') => {
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Form Submitted:', formData);
    setLoading(true);
    setError(null);

    try {
      // Make sure user exists and has an ID
      if (!user || !user._id) {
        setError('❌ User information not available. Please login again.');
        setLoading(false);
        return;
      }

      // Create form data object for submission
      const submissionData = {
        // Personal details
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullname: `${formData.firstName} ${formData.lastName}`, // Make sure fullname is set correctly
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        email: formData.email || user.email, // Use existing email as fallback
        phoneNumber: formData.phone || user.phoneNumber, // Use existing phone as fallback
        tinNumber: formData.tin,

        // Address details
        country: formData.country,
        state: formData.state,
        city: formData.city,
        subcity: formData.subcity,
        zone: formData.zone,
        wereda: formData.wereda,
        kebele: formData.kebele,
        houseNo: formData.houseNo
      };

      // Use the updateUserData utility instead of direct API call
      await updateUserData(submissionData);

      alert('Application Submitted!');
      router.push('/policy-purchase/vehicle-information/purpose');

      // Clear personal details and address from localStorage
      localStorage.removeItem('personal-details-storage');
      localStorage.removeItem('address-details-storage');

      // Reset the Zustand stores
      resetForm();  // Reset personal data store
      resetAddress();  // Reset address data store

    } catch (err: unknown) {
      console.error('Form submission error:', err);

      if (err instanceof Error) {
        const error = err as Error & {
          response?: {
            data?: { message?: string };
            status?: number;
            statusText?: string;
          };
          request?: unknown;
        };

        if (error.response) {
          setError(
            `❌ ${error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`}`
          );
        } else if (error.request) {
          setError('❌ Network error: No response from server. Please check your connection.');
        } else {
          setError(`❌ ${error.message || 'An unknown error occurred'}`);
        }
      } else {
        setError('❌ An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="px-4">
      <h2 className="text-2xl lg:ml-16 mb-4 font-bold">Preview</h2>

      <div className="max-w-5xl mx-auto p-6 px-12 bg-white shadow-lg rounded-lg">
        {/* Personal Information */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">Personal Information</h2>
            <button onClick={() => toggleEdit('personalInfo')} className="text-blue-500 hover:text-blue-700">
              {isEditing.personalInfo ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>

          {isEditing.personalInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-lg">
              {/* Editable fields: title, firstName, lastName, gender, dateOfBirth, nationality, email, phone, tin */}
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Title *</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Nationality *</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Ethiopian">Ethiopian</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">TIN No.</label>
                <input
                  type="text"
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4">
              <div><strong>Title:</strong> {formData.title}</div>
              <div><strong>First Name:</strong> {formData.firstName}</div>
              <div><strong>Last Name:</strong> {formData.lastName}</div>
              <div><strong>Gender:</strong> {formData.gender}</div>
              <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
              <div><strong>Nationality:</strong> {formData.nationality}</div>
              <div><strong>Email:</strong> {formData.email || 'Not provided'}</div>
              <div><strong>Phone:</strong> {formData.phone || 'Not provided'}</div>
              <div><strong>TIN No.:</strong> {formData.tin || 'Not provided'}</div>
            </div>
          )}
        </div>

        {/* Address Information */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">Address Information</h2>
            <button onClick={() => toggleEdit('address')} className="text-blue-500 hover:text-blue-700">
              {isEditing.address ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>

          {isEditing.address ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-lg">
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Ethiopia">Ethiopia</option>
                </select>
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Subcity</label>
                <input
                  type="text"
                  name="subcity"
                  value={formData.subcity}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Zone</label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Wereda</label>
                <input
                  type="text"
                  name="wereda"
                  value={formData.wereda}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Kebele</label>
                <input
                  type="text"
                  name="kebele"
                  value={formData.kebele}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="relative">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">House No.</label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4">
              <div><strong>Country:</strong> {formData.country}</div>
              <div><strong>State:</strong> {formData.state || 'Not provided'}</div>
              <div><strong>City:</strong> {formData.city || 'Not provided'}</div>
              <div><strong>Subcity:</strong> {formData.subcity || 'Not provided'}</div>
              <div><strong>Zone:</strong> {formData.zone || 'Not provided'}</div>
              <div><strong>Wereda:</strong> {formData.wereda || 'Not provided'}</div>
              <div><strong>Kebele:</strong> {formData.kebele || 'Not provided'}</div>
              <div><strong>House No.:</strong> {formData.houseNo || 'Not provided'}</div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 rounded-md py-2 text-lg font-semibold hover:bg-green-600"
          >
            {loading ? <span className='loading loading-dots loading-lg'></span> : "Submit Application"}
          </button>
        </div>

        {error && <p className='text-sm text-red-400'>{error}</p>}
      </div>
    </div>
  );
}
