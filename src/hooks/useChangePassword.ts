import { useState } from 'react';
import axios from 'axios';
import api from '../lib/axios';

const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const changePassword = async (currentPassword, newPassword, retypeNewPassword) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.patch('http://localhost:3333/account/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                retype_new_password: retypeNewPassword,
            });
            console.log(response.data)
            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading, error, success };
};

export default useChangePassword;
