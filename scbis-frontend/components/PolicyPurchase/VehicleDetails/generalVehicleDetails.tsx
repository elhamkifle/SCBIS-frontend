"use client";

import { useRouter } from 'next/navigation';
import { useGeneralVehicleStore } from '@/store/vehicleDetails/generalVehicle';
import { useVehicleSelectionStore } from '@/store/vehicleSelection/vehicleSelectionStore';
import { useEffect } from 'react';

export default function GeneralVehicleDetailForm() {
    const router = useRouter();
    const { formData, setFormData, logFormData } = useGeneralVehicleStore();
    const { isExistingVehicle, vehicleData } = useVehicleSelectionStore();

    // Pre-fill form based on selected vehicle data
    useEffect(() => {
        console.log('🔍 Checking for pre-selected vehicle data in general details page...');
        console.log('📋 Vehicle selection state:', { isExistingVehicle, vehicleData });

        if (isExistingVehicle && vehicleData) {
            console.log('✅ Pre-filling general details form with existing vehicle data');

            let generalDetails;

            // Handle both private and commercial vehicles
            if (vehicleData.privateVehicle?.generalDetails) {
                generalDetails = vehicleData.privateVehicle.generalDetails;
            } else if (vehicleData.commercialVehicle?.generalDetails) {
                generalDetails = vehicleData.commercialVehicle.generalDetails;
            }

            if (generalDetails) {
                // Map the API data to form fields
                const preFilledData = {
                    make: generalDetails.make || '',
                    model: generalDetails.model || '',
                    mfgYear: generalDetails.manufacturingYear?.toString() || '',
                    engineCapacity: generalDetails.engineCapacity?.toString() || '',
                    chassisNo: generalDetails.chassisNumber || '',
                    engineNo: generalDetails.engineNumber || '',
                    plateNo: generalDetails.plateNumber || '',
                    bodyType: generalDetails.bodyType || '',
                };

                setFormData(preFilledData);
                console.log('✅ General details pre-filled:', preFilledData);
            }
        } else {
            console.log('🆕 New vehicle creation - form will remain empty');
            // Clear form for new vehicle
            setFormData({
                make: '',
                model: '',
                mfgYear: '',
                engineCapacity: '',
                chassisNo: '',
                engineNo: '',
                plateNo: '',
                bodyType: '',
            });
        }
    }, [isExistingVehicle, vehicleData, setFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        console.log(`👆 User manually updated ${e.target.name}: ${e.target.value}`);
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        logFormData();
        router.push('/policy-purchase/vehicle-information/ownershipAndUsage');
    };

    const handlePrevious = () => {
        router.back()
    };

    return (
        <div className="flex flex-col items-center px-4">
            <div className="w-full max-w-5xl flex justify-between items-center mt-8">
                <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
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
                    <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">General Vehicle Details</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
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
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Make *</label>
                        <select name="make" value={formData.make} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                            <option value="Nissan">Nissan</option>
                            <option value="Chevrolet">Chevrolet</option>
                            <option value="Hyundai">Hyundai</option>
                            <option value="Kia">Kia</option>
                            <option value="Volkswagen">Volkswagen</option>
                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                            <option value="BMW">BMW</option>
                            <option value="Audi">Audi</option>
                            <option value="Subaru">Subaru</option>
                            <option value="Mazda">Mazda</option>
                            <option value="Jeep">Jeep</option>
                            <option value="Lexus">Lexus</option>
                            <option value="Mitsubishi">Mitsubishi</option>
                            <option value="Suzuki">Suzuki</option>
                            <option value="Peugeot">Peugeot</option>
                            <option value="Renault">Renault</option>
                            <option value="Land Rover">Land Rover</option>
                            <option value="Isuzu">Isuzu</option>
                            <option value="Tesla">Tesla</option>
                        </select>
                    </div>
                    <div className="relative w-full">
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Model *</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Mfg Year *</label>
                        <select name="mfgYear" value={formData.mfgYear} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                            <option value="2010">2010</option>
                            <option value="2005">2005</option>
                            <option value="2000">2000</option>
                            <option value="1995">1995</option>
                            <option value="1990">1990</option>
                            <option value="1980">1980</option>
                        </select>
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">CC (Engine Capacity) *</label>
                        <input type="text" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Chassis No. *</label>
                        <input type="text" name="chassisNo" value={formData.chassisNo} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Engine No. *</label>
                        <input type="text" name="engineNo" value={formData.engineNo} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Plate No. * </label>
                        <input type="text" name="plateNo" value={formData.plateNo} onChange={handleChange} className="w-full p-2 border border-black rounded" required />
                    </div>
                    <div className='relative w-full'>
                        <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Body Type *</label>
                        <select name="bodyType" value={formData.bodyType} onChange={handleChange} className="w-full p-2 border border-black rounded" required>
                            <option value="">Select</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Convertible">Convertible</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Wagon">Wagon</option>
                            <option value="Van">Van</option>
                            <option value="Minivan">Minivan</option>
                            <option value="Pickup">Pickup</option>
                            <option value="Crossover">Crossover</option>
                            <option value="Bus">Bus</option>
                            <option value="Limousine">Limousine</option>
                        </select>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-between">
                        <button type="button" className="bg-[#3AA4FF] text-white p-7 py-2 rounded" onClick={handlePrevious}>Previous</button>
                        <button type="submit" className="bg-blue-500 text-white p-10 py-2 rounded">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}