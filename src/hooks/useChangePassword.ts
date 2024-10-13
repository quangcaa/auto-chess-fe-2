import { useState } from 'react';

const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const changePassword = async (currentPassword, newPassword, retypeNewPassword) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem('accessToken')

        try {
            const response = await fetch('http://localhost:3333/account/change-password', {
                method: 'PATCH',
                headers: {
                    'x_authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    retype_new_password: retypeNewPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            setSuccess(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading, error, success };
};

export default useChangePassword;
