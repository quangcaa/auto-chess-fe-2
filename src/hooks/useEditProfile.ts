import { useState } from 'react';
import api from '../lib/axios';

const useEditProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const editProfile = async (profileData) => {
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            // Send profileData as the request body
            await api.put('http://localhost:3333/account/edit-profile', profileData);
            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || error.message); // Improved error handling
        } finally {
            setLoading(false);
        }
    };

    return { editProfile, loading, error, success };
};

export default useEditProfile;
