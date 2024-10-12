import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Login } from './components/Login';

function App() {
  return (
    <div className='h-screen bg-main-color'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </ div>
  )
}

export default App
