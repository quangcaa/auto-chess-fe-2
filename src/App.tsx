import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Login } from './components/Login';
import Profile from './screens/Profile';
import { Setting } from './screens/Setting';

function App() {
  return (
    <div className='h-screen bg-main-color'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/' element={<Landing />} />
          <Route path='/game' element={<Game />} />
          <Route path='/my-profile' element={<Profile />} />
          <Route path='/setting' element={<Setting />} />
        </Routes>
      </BrowserRouter>
    </ div>
  )
}

export default App
