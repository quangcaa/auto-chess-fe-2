import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Auth } from './screens/Auth';
import { Profile } from './screens/Profile';
import { Setting } from './screens/Setting';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { Topic } from './components/Topic';
import {PostList} from './components/PostList';
// import { Post } from './components/Post';

function App() {
  return (
    <div className='h-full bg-main-color'>
      <AuthProvider>
        <BrowserRouter>

          <Routes>
          <Route path='/postlist' element={<PostList />}/>
          <Route path='/topic' element={<Topic />}/>
            <Route path='/*' element={<Auth />} />
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Landing />} />
              <Route path='/game' element={<Game />} />
              <Route path='/my-profile' element={<Profile />} />
              <Route path='/setting' element={<Setting />} />
              
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ div>
  )
}

export default App
