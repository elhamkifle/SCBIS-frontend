'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useCommercialVehicleCategoryStore } from '@/store/vehicleDetails/commercialVehicle';
import { useSnackbar } from '@/hooks/useSnackbar';
import Snackbar from '@/components/ui/Snackbar';

export default function CommercialVehicleCategory() {
    const router = useRouter();
    const { selectedCategories, toggleCategory } = useCommercialVehicleCategoryStore();
    const { snackbar, showWarning, hideSnackbar } = useSnackbar();

    const handlePrevious = () => {
        router.push('/policy-purchase/vehicle-information/purpose');
    };

    const handleNext = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        // Validate at least one category is selected
        if (Object.values(selectedCategories).some(val => val)) {
            router.push('/policy-purchase/vehicle-information/generalVehicleDetails');
        } else {
            showWarning('Please select at least one vehicle category');
        }
    };

    const handleForward = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        // Validate at least one category is selected
        if (Object.values(selectedCategories).some(val => val)) {
            router.push('/policy-purchase/vehicle-information/commercialVehicleCategory2');
        } else {
            showWarning('Please select at least one vehicle category');
        }
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
                    <div className="w-7 h-7 flex items-center justify-center text-white bg-[#1F4878] rounded-full">2</div>
                    <span className="ml-2 text-black text-xs sm:text-base">Vehicle Category</span>
                </div>
                <div className="w-7 sm:border-t-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
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

            <div className="bg-white mb-10 p-2 lg:p-8 rounded-lg w-full max-w-5xl" style={{ boxShadow: '0 0 8px rgba(0, 123, 255, 0.4)' }}>
                <form className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
                    <div className='col-span-1 md:col-span-3 flex flex-col gap-5'>
                        <p className='font-syne text-sm md:text-base lg:text-lg font-semibold'>Select one category that best describes your vehicle. (Required)</p>

                        <div className='flex flex-col flex-wrap sm:flex-row gap-8 lg:flex-nowrap gap-5'>
                            <div className='w-full flex flex-col md:block md:w-1/2'>
                                <p className='font-syne text-sm text-[#1A73E8] text-center font-bold'>Passenger Carrying Vehicles (PCV)</p>
                                <div className='flex flex-col justify-between md:flex-row'>
                                    <div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-sm font-semibold'>Taxi</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['taxi_small_buses'] || false}
                                                    onChange={() => toggleCategory('taxi_small_buses')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Small Sized Buses</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['taxi_medium_buses'] || false}
                                                    onChange={() => toggleCategory('taxi_medium_buses')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Medium Sized Buses</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['taxi_large_buses'] || false}
                                                    onChange={() => toggleCategory('taxi_large_buses')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Large Sized Buses</label>
                                            </div>
                                        </div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-sm font-semibold'>Minibus</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['minibus_own_service'] || false}
                                                    onChange={() => toggleCategory('minibus_own_service')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Own Service</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['minibus_public_service'] || false}
                                                    onChange={() => toggleCategory('minibus_public_service')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Public Service</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-sm font-semibold'>Buses</p>
                                            <p className='font-syne text-xs font-semibold text-[#1A73E8]'>own service</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['buses_own_small'] || false}
                                                    onChange={() => toggleCategory('buses_own_small')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Small Sized Buses</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['buses_own_medium'] || false}
                                                    onChange={() => toggleCategory('buses_own_medium')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Medium Sized Buses</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['buses_own_large'] || false}
                                                    onChange={() => toggleCategory('buses_own_large')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Large Sized Buses</label>
                                            </div>
                                        </div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-xs font-semibold text-[#1A73E8]'>Public service</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['buses_public_small'] || false}
                                                    onChange={() => toggleCategory('buses_public_small')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Small Sized Buses</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['buses_public_medium'] || false}
                                                    onChange={() => toggleCategory('buses_public_medium')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Medium Sized Buses</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['buses_public_large'] || false}
                                                    onChange={() => toggleCategory('buses_public_large')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Large Sized Buses</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='w-full md:w-1/2'>
                                <p className='font-syne text-sm text-center text-[#1A73E8] font-bold'>Goods Carrying Vehicles (GCV)</p>
                                <p className='font-syne text-sm font-semibold mt-2'>Dry Goods Carrying</p>
                                <div className='flex flex-col justify-between md:flex-row'>
                                    <div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-xs text-[#1A73E8] font-semibold'>own Goods</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['own_goods_pickups'] || false}
                                                    onChange={() => toggleCategory('own_goods_pickups')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Pick-Ups</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['own_goods_trucks'] || false}
                                                    onChange={() => toggleCategory('own_goods_trucks')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Trucks</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['own_goods_trailers'] || false}
                                                    onChange={() => toggleCategory('own_goods_trailers')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Trailers</label>
                                            </div>
                                        </div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-xs text-[#1A73E8] font-semibold'>Hire Goods</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['hire_goods_pickups'] || false}
                                                    onChange={() => toggleCategory('hire_goods_pickups')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Pick-Ups</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['hire_goods_trucks'] || false}
                                                    onChange={() => toggleCategory('hire_goods_trucks')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Trucks</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['hire_goods_trailers'] || false}
                                                    onChange={() => toggleCategory('hire_goods_trailers')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Trailers</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-sm font-semibold'>Specialized Vehicles</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['specialized_vehicles'] || false}
                                                    onChange={() => toggleCategory('specialized_vehicles')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Specialized Vehicles</label>
                                            </div>
                                        </div>
                                        <div className='p-2 flex flex-col gap-3'>
                                            <p className='font-syne text-sm font-semibold'>Construction Vehicles</p>
                                            <div className='flex gap-2 items-center'>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories['construction_vehicles'] || false}
                                                    onChange={() => toggleCategory('construction_vehicles')}
                                                    className="bg-white border border-black rounded"
                                                />
                                                <label className='font-inter text-sm md:text-xs lg:text-xs'>Construction Vehicles</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-between">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded"
                        >
                            Previous
                        </button>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-[#1A73E8] hover:bg-blue-700 text-white p-2 rounded"
                            >
                                Next
                            </button>
                            <button
                                type="button"
                                onClick={handleForward}
                                className="bg-[#23C140] hover:bg-green-700 text-white p-2 rounded"
                            >
                                Forward
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.isOpen}
                onClose={hideSnackbar}
            />
        </div>
    );
}