import { BrowserRouter, Routes, Route } from 'react-router-dom'

import About from './pages/About'
import Home from './pages/Home'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Header from './components/Header'

import React from 'react'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>      
  )
}
