import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {Login}  from '../components/Login';
import {Register} from '../components/Register';
import { ResetPassword } from '../components/ResetPassword';
import { VerifyEmail } from '../components/VerifyEmail';


export const Auth: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />
        </Routes>
    );
};


