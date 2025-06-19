"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { usePersonalDetailStore } from '@/store/customerInformationStore/personalDetails';
import { useUserStore } from '@/store/authStore/useUserStore';

export default function PersonalDetailForm() {
    const router = useRouter();
    const { formData, updateFormData, logFormData, setOriginalData, isDataModified } = usePersonalDetailStore();
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    const dataLoadedRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load user data when the component mounts, but only once
    useEffect(() => {
        // Skip if we've already loaded data or if there's no user
        if (dataLoadedRef.current || !user) return;

        // Extract name parts from fullname if available
        let firstName = '';
        let lastName = '';

        if (user.fullname) {
            const nameParts = user.fullname.split(' ');
            if (nameParts.length >= 2) {
                // Assume first part is firstName, rest is lastName
                firstName = nameParts[0];
                lastName = nameParts.slice(1).join(' ');
            } else if (nameParts.length === 1) {
                firstName = nameParts[0];
            }
        }

        // Create user data object from backend response
        const userData = {
            title: user.title || '',
            firstName: firstName,
            lastName: lastName,
            gender: user.gender || '',
            dateOfBirth: user.dateOfBirth || '',
            nationality: user.nationality || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
            tin: user.tinNumber || '',
        };

        // Set this as the original data and current form data
        setOriginalData(userData);
        // Mark as loaded so we don't try again
        dataLoadedRef.current = true;
    }, [user, setOriginalData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isDataModified) {
            // If data is modified, submit to backend
            setIsSubmitting(true);
            try {
                // Update user data in backend
                const updateData = {
                    title: formData.title,
                    fullname: `${formData.firstName} ${formData.lastName}`,
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    nationality: formData.nationality,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    tinNumber: formData.tin,
                };

                // Here you would call your API to update user data
                // For now, I'll update the local user store
                if (user) {
                    const updatedUser = {
                        ...user,
                        ...updateData,
                        fullname: updateData.fullname,
                    };
                    setUser(updatedUser);
                }

                console.log('Personal details updated:', updateData);

                // Update the original data to reflect the new saved state
                setOriginalData(formData);

            } catch (error) {
                console.error('Error updating personal details:', error);
                // Handle error appropriately
            } finally {
                setIsSubmitting(false);
            }
        }

        logFormData();
        router.push('/policy-purchase/personal-information/address');
    };

    const handleSaveAsDraft = () => {
        logFormData();
        // alert('Your information has been saved as draft.');
    };

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
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
            <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl lg:min-h-[350px] xl:min-h-[480px] xl:p-6"
                style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }} >

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-16 xl:gap-20">
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="title">Title</label>
                        <select
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Title"
                        >
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="firstName">
                            First Name *
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="First Name"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1" htmlFor="lastName">Last Name *</label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Last Name"
                            placeholder="Enter last name"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="gender">Gender *</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Gender"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="dateOfBirth">Date Of Birth *</label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Date of Birth"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="nationality">Nationality *</label>
                        <select
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            aria-label="Nationality"
                        >
                            <option value="">Select</option>
                            <option value="Ethiopian">Ethiopian</option>
                            <option value="Afghan">Afghan</option>
                            <option value="Albanian">Albanian</option>
                            <option value="Algerian">Algerian</option>
                            <option value="American">American</option>
                            <option value="Andorran">Andorran</option>
                            <option value="Angolan">Angolan</option>
                            <option value="Antiguan">Antiguan</option>
                            <option value="Argentine">Argentine</option>
                            <option value="Armenian">Armenian</option>
                            <option value="Australian">Australian</option>
                            <option value="Austrian">Austrian</option>
                            <option value="Azerbaijani">Azerbaijani</option>
                            <option value="Bahamian">Bahamian</option>
                            <option value="Bahraini">Bahraini</option>
                            <option value="Bangladeshi">Bangladeshi</option>
                            <option value="Barbadian">Barbadian</option>
                            <option value="Belarusian">Belarusian</option>
                            <option value="Belgian">Belgian</option>
                            <option value="Belizean">Belizean</option>
                            <option value="Beninese">Beninese</option>
                            <option value="Bhutanese">Bhutanese</option>
                            <option value="Bolivian">Bolivian</option>
                            <option value="Bosnian">Bosnian</option>
                            <option value="Botswanan">Botswanan</option>
                            <option value="Brazilian">Brazilian</option>
                            <option value="British">British</option>
                            <option value="Bruneian">Bruneian</option>
                            <option value="Bulgarian">Bulgarian</option>
                            <option value="Burkinabe">Burkinabe</option>
                            <option value="Burmese">Burmese</option>
                            <option value="Burundian">Burundian</option>
                            <option value="Cambodian">Cambodian</option>
                            <option value="Cameroonian">Cameroonian</option>
                            <option value="Canadian">Canadian</option>
                            <option value="Cape Verdean">Cape Verdean</option>
                            <option value="Central African">Central African</option>
                            <option value="Chadian">Chadian</option>
                            <option value="Chilean">Chilean</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Colombian">Colombian</option>
                            <option value="Comoran">Comoran</option>
                            <option value="Congolese">Congolese</option>
                            <option value="Costa Rican">Costa Rican</option>
                            <option value="Croatian">Croatian</option>
                            <option value="Cuban">Cuban</option>
                            <option value="Cypriot">Cypriot</option>
                            <option value="Czech">Czech</option>
                            <option value="Danish">Danish</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominican">Dominican</option>
                            <option value="Dutch">Dutch</option>
                            <option value="East Timorese">East Timorese</option>
                            <option value="Ecuadorean">Ecuadorean</option>
                            <option value="Egyptian">Egyptian</option>
                            <option value="Emirian">Emirian</option>
                            <option value="Equatorial Guinean">Equatorial Guinean</option>
                            <option value="Eritrean">Eritrean</option>
                            <option value="Estonian">Estonian</option>
                            <option value="Fijian">Fijian</option>
                            <option value="Filipino">Filipino</option>
                            <option value="Finnish">Finnish</option>
                            <option value="French">French</option>
                            <option value="Gabonese">Gabonese</option>
                            <option value="Gambian">Gambian</option>
                            <option value="Georgian">Georgian</option>
                            <option value="German">German</option>
                            <option value="Ghanaian">Ghanaian</option>
                            <option value="Greek">Greek</option>
                            <option value="Grenadian">Grenadian</option>
                            <option value="Guatemalan">Guatemalan</option>
                            <option value="Guinea-Bissauan">Guinea-Bissauan</option>
                            <option value="Guinean">Guinean</option>
                            <option value="Guyanese">Guyanese</option>
                            <option value="Haitian">Haitian</option>
                            <option value="Herzegovinian">Herzegovinian</option>
                            <option value="Honduran">Honduran</option>
                            <option value="Hungarian">Hungarian</option>
                            <option value="Icelander">Icelander</option>
                            <option value="Indian">Indian</option>
                            <option value="Indonesian">Indonesian</option>
                            <option value="Iranian">Iranian</option>
                            <option value="Iraqi">Iraqi</option>
                            <option value="Irish">Irish</option>
                            <option value="Israeli">Israeli</option>
                            <option value="Italian">Italian</option>
                            <option value="Ivorian">Ivorian</option>
                            <option value="Jamaican">Jamaican</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Jordanian">Jordanian</option>
                            <option value="Kazakhstani">Kazakhstani</option>
                            <option value="Kenyan">Kenyan</option>
                            <option value="Kittian and Nevisian">Kittian and Nevisian</option>
                            <option value="Kuwaiti">Kuwaiti</option>
                            <option value="Kyrgyz">Kyrgyz</option>
                            <option value="Laotian">Laotian</option>
                            <option value="Latvian">Latvian</option>
                            <option value="Lebanese">Lebanese</option>
                            <option value="Liberian">Liberian</option>
                            <option value="Libyan">Libyan</option>
                            <option value="Liechtensteiner">Liechtensteiner</option>
                            <option value="Lithuanian">Lithuanian</option>
                            <option value="Luxembourger">Luxembourger</option>
                            <option value="Macedonian">Macedonian</option>
                            <option value="Malagasy">Malagasy</option>
                            <option value="Malawian">Malawian</option>
                            <option value="Malaysian">Malaysian</option>
                            <option value="Maldivan">Maldivan</option>
                            <option value="Malian">Malian</option>
                            <option value="Maltese">Maltese</option>
                            <option value="Marshallese">Marshallese</option>
                            <option value="Mauritanian">Mauritanian</option>
                            <option value="Mauritian">Mauritian</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Micronesian">Micronesian</option>
                            <option value="Moldovan">Moldovan</option>
                            <option value="Monacan">Monacan</option>
                            <option value="Mongolian">Mongolian</option>
                            <option value="Moroccan">Moroccan</option>
                            <option value="Mosotho">Mosotho</option>
                            <option value="Motswana">Motswana</option>
                            <option value="Mozambican">Mozambican</option>
                            <option value="Namibian">Namibian</option>
                            <option value="Nauruan">Nauruan</option>
                            <option value="Nepalese">Nepalese</option>
                            <option value="New Zealander">New Zealander</option>
                            <option value="Nicaraguan">Nicaraguan</option>
                            <option value="Nigerian">Nigerian</option>
                            <option value="Nigerien">Nigerien</option>
                            <option value="North Korean">North Korean</option>
                            <option value="Northern Irish">Northern Irish</option>
                            <option value="Norwegian">Norwegian</option>
                            <option value="Omani">Omani</option>
                            <option value="Pakistani">Pakistani</option>
                            <option value="Palauan">Palauan</option>
                            <option value="Panamanian">Panamanian</option>
                            <option value="Papua New Guinean">Papua New Guinean</option>
                            <option value="Paraguayan">Paraguayan</option>
                            <option value="Peruvian">Peruvian</option>
                            <option value="Polish">Polish</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Qatari">Qatari</option>
                            <option value="Romanian">Romanian</option>
                            <option value="Russian">Russian</option>
                            <option value="Rwandan">Rwandan</option>
                            <option value="Saint Lucian">Saint Lucian</option>
                            <option value="Salvadoran">Salvadoran</option>
                            <option value="Samoan">Samoan</option>
                            <option value="San Marinese">San Marinese</option>
                            <option value="Sao Tomean">Sao Tomean</option>
                            <option value="Saudi">Saudi</option>
                            <option value="Scottish">Scottish</option>
                            <option value="Senegalese">Senegalese</option>
                            <option value="Serbian">Serbian</option>
                            <option value="Seychellois">Seychellois</option>
                            <option value="Sierra Leonean">Sierra Leonean</option>
                            <option value="Singaporean">Singaporean</option>
                            <option value="Slovakian">Slovakian</option>
                            <option value="Slovenian">Slovenian</option>
                            <option value="Solomon Islander">Solomon Islander</option>
                            <option value="Somali">Somali</option>
                            <option value="South African">South African</option>
                            <option value="South Korean">South Korean</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Sri Lankan">Sri Lankan</option>
                            <option value="Sudanese">Sudanese</option>
                            <option value="Surinamer">Surinamer</option>
                            <option value="Swazi">Swazi</option>
                            <option value="Swedish">Swedish</option>
                            <option value="Swiss">Swiss</option>
                            <option value="Syrian">Syrian</option>
                            <option value="Taiwanese">Taiwanese</option>
                            <option value="Tajik">Tajik</option>
                            <option value="Tanzanian">Tanzanian</option>
                            <option value="Thai">Thai</option>
                            <option value="Togolese">Togolese</option>
                            <option value="Tongan">Tongan</option>
                            <option value="Trinidadian or Tobagonian">Trinidadian or Tobagonian</option>
                            <option value="Tunisian">Tunisian</option>
                            <option value="Turkish">Turkish</option>
                            <option value="Tuvaluan">Tuvaluan</option>
                            <option value="Ugandan">Ugandan</option>
                            <option value="Ukrainian">Ukrainian</option>
                            <option value="Uruguayan">Uruguayan</option>
                            <option value="Uzbekistani">Uzbekistani</option>
                            <option value="Venezuelan">Venezuelan</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Welsh">Welsh</option>
                            <option value="Yemenite">Yemenite</option>
                            <option value="Zambian">Zambian</option>
                            <option value="Zimbabwean">Zimbabwean</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Email Address"
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="phone">Additional Phone No.</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Additional Phone Number"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1" htmlFor="tin">TIN No.</label>
                        <input
                            id="tin"
                            type="text"
                            name="tin"
                            value={formData.tin}
                            onChange={handleChange}
                            className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="TIN Number"
                            placeholder="Enter TIN number"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${isDataModified
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-[#1A73E8] hover:bg-blue-700'
                                } text-white p-7 py-2 rounded transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            aria-label={isDataModified ? "Submit" : "Next"}
                        >
                            {isSubmitting ? 'Submitting...' : (isDataModified ? 'Submit' : 'Next')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
