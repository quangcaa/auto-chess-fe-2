import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Landing } from './screens/Landing'
import { Game } from './screens/Game'
import { Auth } from './screens/Auth'
import { Profile } from './screens/Profile'
import { Setting } from './screens/Setting'
import { CreateTopic } from './components/forum/CreateTopic'
import { Forum } from './screens/Forum'
import { TopicList } from './components/forum/TopicList'
import { useAuth } from './context/AuthContext'
import NavBar from './components/layout/Navbar'
import AuthGuard from './guard/AuthGuard'
import GuestGuard from './guard/GuestGuard'
import { PostList } from './components/forum/PostList'
import Inbox from './screens/Inbox'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="h-screen bg-main-color">
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path='/postlist' element={<PostList />} />
        <Route element={<GuestGuard />}>
          <Route path="/*" element={<Auth />} />
        </Route>
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/forum/*" element={<Forum />} />
          <Route path='/inbox' element={<Inbox />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App