import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Auth } from './screens/Auth';
import { Profile } from './screens/Profile';
import { Setting } from './screens/Setting';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import  NavBar from './components/NavBar';

function App() {
  return (
    <div className='h-screen bg-main-color'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<NavBar />}>
            <Route path='/*' element={<Auth />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Landing />} />
              <Route path='/game' element={<Game />} />
              <Route path='/my-profile' element={<Profile />} />
              <Route path='/setting' element={<Setting />} />
              </Route>  
          </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ div>
  )
}

export default App
