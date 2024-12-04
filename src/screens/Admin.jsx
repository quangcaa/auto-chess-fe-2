import { ReportedUser } from "@/components/admin/ReportedUser"
import { Routes, Route } from "react-router-dom"

export const Admin = () => {
    return (
        <div className="flex h-screen">
            <div className="flex-1 bg-main-color p-8 overflow-auto">
                <Routes>
                    <Route path="/" element={<ReportedUser />} />
                </Routes>
            </div>
        </div>
    )
}