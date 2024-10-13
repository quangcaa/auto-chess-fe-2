import { useState } from 'react';

const useEditProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const editProfile = async (profileData) => {
        setLoading(true);
        setError("");
        setSuccess(false);

        const token = localStorage.getItem('accessToken');

        if (!token) {
            setError('Access token not found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/account/edit-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to edit profile');
            }

            setSuccess(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { editProfile, loading, error, success };
};

export default useEditProfile;
