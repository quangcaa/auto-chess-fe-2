import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {Login}  from '../components/Login';
import {Register} from '../components/Register';


export const Auth: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
};


