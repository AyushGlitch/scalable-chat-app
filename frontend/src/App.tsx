
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element= {<Home />} />
        <Route path= '/login' element={<Login />} />
        <Route path= '/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
