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
import { CreateTopic } from './components/CreateTopic';
import { Forum } from './screens/Forum';
import { TopicList } from './components/TopicList';

function App() {
  return (
    <div className='h-screen bg-main-color'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<NavBar />}>
            <Route path='/*' element={<Auth />} />
           
              <Route path="/" element={<Landing />} />
              <Route path='/game' element={<Game />} />
              <Route path='/my-profile' element={<Profile />} />
              <Route path='/setting' element={<Setting />} />
              </Route>  
          
              <Route path='/forum' element={<Forum />} />
              <Route path='/forum/category' element={<TopicList />} />
              <Route path='/forum/category/create-topic' element={<CreateTopic />} />
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ div>
  )
}

export default App
