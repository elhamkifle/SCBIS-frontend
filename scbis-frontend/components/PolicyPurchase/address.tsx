'use client';

import { useState } from 'react';

export default function AddressForm() {
    const [formData, setFormData] = useState({
        country: '',
        state: '',
        city: '',
        subcity: '',
        zone: '',
        wereda: '',
        kebele: '',
        houseNo: '',
    });

    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
        'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
        'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
        'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso',
        'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic',
        'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica',
        'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo',
        'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
        'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
        'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
        'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
        'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
        'Korea (North)', 'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
        'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
        'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
        'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia',
        'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia',
        'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
        'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
        'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
        'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
        'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
        'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
        'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
        'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
        'Yemen', 'Zambia', 'Zimbabwe'
    ];

    const ethiopianRegions = [
        'Addis Ababa', 'Afder', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
        'Gambela', 'Harari', 'Oromia', 'Sidama', 'Southern Nations, Nationalities, and Peoples\' Region (SNNPR)',
        'Somali', 'Tigray'
    ];

    const ethiopianCities = [
        'Addis Ababa', 'Adama', 'Hawassa', 'Mekelle', 'Dire Dawa', 'Jimma', 'Bahir Dar',
        'Gondar', 'Dessie', 'Jijiga', 'Nazret', 'Ambo', 'Awassa', 'Arba Minch', 'Asella',
        'Debre Birhan', 'Kombolcha', 'Woldiya', 'Shashemene', 'Goba', 'Debre Markos', 'Mizan Teferi',
        'Harar', 'Assosa', 'Nejo', 'Bedele', 'Bahir Dar', 'Fiche', 'Buta Jirra', 'Finote Selam',
        'Bahir Dar', 'Kochere', 'Kebri Dehar', 'Dilla', 'Lalibela'
    ];



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl relative">
                <button type="button" className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded">Save as draft</button>
                <h2 className="text-2xl font-bold mb-4 text-left">Policy Purchase</h2>
                <div className="flex flex-col md:flex-row items-start sm:pl-8 justify-around mb-6">
                    <div className="relative z-10 flex items-center mb-4 md:mb-0">
                        <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
                        <span className="ml-2 font-medium text-gray-700 text-sm md:text-base">Personal Detail</span>
                    </div>
                    <div className="relative z-10 flex items-center mb-4 md:mb-0">
                        <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">2</div>
                        <span className="ml-2 text-gray-500 text-sm md:text-base">Address</span>
                    </div>
                    <div className="relative z-10 flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">3</div>
                        <span className="ml-2 text-gray-500 text-sm md:text-base">Upload ID</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700">Country *</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select a country</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label className="block text-gray-700">Region *</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">State/Region</option>
                            {ethiopianRegions.map((region, index) => (
                                <option key={index} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div>
                            <label className="block text-gray-700">City *</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select a city</option>
                                {ethiopianCities.map((city, index) => (
                                    <option key={index} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">Subcity *</label>
                        <input type="text" name="nationality" value={formData.subcity} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Zone</label>
                        <input type="text" name="zone" value={formData.zone} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Wereda</label>
                        <input type="text" name="wereda" value={formData.wereda} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Kebele</label>
                        <input type="text" name="kebele" value={formData.kebele} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700">House No.</label>
                        <input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-between mt-4">
                        <button type="button" className="bg-gray-700 text-white px-4 py-2 rounded">Previous</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>                    </div>
                </form>
            </div>
        </div>
    );
}
