import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './Navbar'

const Layout: React.FC = () => {
  const location = useLocation()
  const hideNavbarRoutes = ['/login', '/register', '/reset-password']

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname)

  return (
    <div className="h-screen bg-main-color">
      {!shouldHideNavbar && <NavBar />}
      <Outlet />
    </div>
  )
}

export default Layout