import { Routes, Route } from "react-router-dom";
import { Login } from "../components/auth/LoginSection";
import { Register } from "../components/auth/RegisterSection";
import { ForgotPassword } from "../components/auth/ForgotPasswordSection";
import { ResetPassword } from "../components/auth/ResetPasswordSection";


export const Auth = () => {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
};
