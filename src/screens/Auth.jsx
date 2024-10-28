import { Routes, Route } from "react-router-dom";
import { Login } from "../components/auth/LoginSection";
import { Register } from "../components/auth/RegisterSection";
import { ResetPassword } from "../components/auth/ResetPasswordSection";

export const Auth = () => {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
};
