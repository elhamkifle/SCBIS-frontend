'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { userHook } from '@/context/userContextProvider';

interface SuccessResult {
    
    statusText:string;
    data:{
        
        secure_url:string
    }
}

export default function UploadIDForm() {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const {User} = JSON.parse(localStorage.getItem('userData')!)
    const {user,dispatch} = userHook()

    console.log('user info here',user)

    const handlePrevious = () => router.push('policy-purchase/vehicle-information/ownershipAndUsage');
    
    const handleNext = async () => {
        if (files.length < 1) {
            setError('❌ Please upload an ID before proceeding.');
        } else {
            setError('');
            const formdata = new FormData()

            formdata.append('file',files[0])
            formdata.append('upload_preset', 'docuploads')
  
            let result = {} as SuccessResult;
  
            if (files){
              result = await axios.post(`https://api.cloudinary.com/v1_1/dmzvqehan/upload`,formdata)
            }
  
            if (result && result.statusText==="OK"){
              dispatch({type:'collect_user_info',payload:{img_url:result.data.secure_url}})
              console.log("here is the user with image_url",user)
              
              const res = await fetch(`http://localhost:4000/user/${User._id}`,{
                method:'PATCH',
                body:JSON.stringify(user),
                headers:{
                    'Content-Type':'application/json'
                }
              })

              const data = await res.json()
              console.log("here is the updated user data",)
              if (res.ok){
                router.push('/policy-purchase/vehicle-information/purpose');
              }
              
            }
            
        }
    };

    const validateFile = (file: File) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            return '❌ Invalid file type. Please upload a valid National ID or Passport in PDF, JPG, or PNG format.';
        } else if (file.size > maxSize) {
            return '❌ File too large. The maximum file size allowed is 5MB.';
        }
        return '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setFiles((prev) => [...prev, selectedFile].slice(0, 1)); // Allow only one file
            }
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const validationError = validateFile(droppedFile);
            if (validationError) {
                setError(validationError);
            } else {
                setError('');
                setFiles((prev) => [...prev, droppedFile].slice(0, 1)); // Allow only one file
            }
        }
    };

    const handleDeleteFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setError('');
    };

    return (
        <div className="flex items-start justify-center h-full px-4">
            <div className="w-full max-w-5xl">
                <div className="flex justify-between items-center">
                    <h2 className="md:text-xl sm:text-lg font-bold mt-8">Policy Purchase</h2>
                    <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
                </div>

            {/* Progress Bar */}
            <div className="flex flex-wrap sm:justify-start md:justify-center items-center gap-4 sm:gap-8 mt-6 mb-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
                    <span className="ml-2 font-medium text-black text-sm sm:text-base">Personal Detail</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full">2</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Address</span>
                </div>
                <div className="w-16 sm:border-t-2 border-l-2 border-gray-400"></div>
                <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
                    <span className="ml-2 text-black text-sm sm:text-base">Upload ID</span>
                </div>
            </div>

                <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl xl:p-6"
                    style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }} >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="text-black">
                            <p className="text-xl font-bold mb-4">Rule for Uploading ID</p>
                            {[ '✅ Allowed Document Types: Only Kebele ID, National ID or Passport are accepted.',
                                '✅ File Format: Only PDF, JPG, PNG files are allowed.',
                                '✅ File Size Limit: Maximum 5MB per file.',
                                '✅ Image Clarity: The ID must be clear, unedited, and all text must be readable.',
                                '✅ Name Match: The name on the ID must match the name entered in the personal details form.',
                                '✅ Expiration Check: The ID must be valid (not expired).',
                                '✅ Duplicate Check: A customer cannot upload an ID already linked to another account.'
                            ].map((rule, idx) => <p key={idx} className="mb-1">{rule}</p>)}
                        </div>

                        <div className="flex flex-col items-center justify-center bg-blue-100 p-6 rounded-lg"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}>
                            <p className='text-xl font-bold mb-2'>Drop Files Here</p>
                            <p className='text-md font-bold mb-4'>Or</p>
                            <input type="file" id="file-upload" accept=".pdf,.jpg,.png" onChange={handleFileChange} className="hidden" />
                            <label htmlFor="file-upload" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">Browse Files</label>
                            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                            {files.map((file, index) => (
                                <div key={index} className="mt-2 text-green-500 text-sm">
                                    ✅ File ready for upload: {file.name}
                                    <button onClick={() => handleDeleteFile(index)} className="ml-2 text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-between mt-4">
                        <button type="button" onClick={handlePrevious} className="bg-[#3AA4FF] text-white p-7 py-2 rounded">Previous</button>
                        <button type="submit" onClick={handleNext} className="bg-green-500 text-white p-7 py-2 rounded">Next Step </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
