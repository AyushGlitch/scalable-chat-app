
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PrivateRoutes from './components/routesProtection/PrivateRoutes'
import Dashboard from './pages/Dashboard'
import Friends from './pages/Friends'
import Rooms from './pages/Rooms'
import Settings from './pages/Settings'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element= {<Home />} />
        <Route path= '/login' element={<Login />} />
        <Route path= '/signup' element={<Signup />} />

        <Route element= {<PrivateRoutes />} >
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/friends' element={<Friends/>} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
