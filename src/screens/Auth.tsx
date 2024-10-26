import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Login } from '../components/auth/LoginSection'
import { Register } from '../components/auth/RegisterSection'
import { ResetPassword } from '../components/auth/ResetPasswordSection'
import { VerifyEmail } from '../components/auth/VerifyEmailSection'

export const Auth: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    )
}