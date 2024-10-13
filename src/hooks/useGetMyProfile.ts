import { useEffect, useState } from 'react';

const useGetMyProfile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/account/my-profile', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log(response)
                throw new Error('Failed to fetch profile');
            }
            console.log(response)
            const data = await response.json();
            console.log(data)
            setProfile(data.profile);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile(); 
    }, []);

    return { profile, loading, error };
};

export default useGetMyProfile;
