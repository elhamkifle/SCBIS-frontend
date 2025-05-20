// utils/uploadToCloudinary.ts
import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'docuploads');

  try {
    const result = await axios.post(
      'https://api.cloudinary.com/v1_1/dmzvqehan/upload',
      formData
    );
    if (result.statusText === 'OK') {
      return result.data.secure_url;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return null;
  }
};



