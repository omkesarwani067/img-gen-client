import React from "react"
import { Routes, Route } from 'react-router-dom'
import BuyCredit from "./pages/Buycredit"
import Home from "./pages/Home"
import Result from "./pages/Result"
import Navbar from './Components/Navbar'
import Login from "./Components/Login"
import Footer from "./Components/Footer"

import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {

  const {showLogin} = useContext(AppContext)


  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-red-200 to-purple-300'>
      <ToastContainer position='bottom-right'/>
      <Navbar />
 
      
      {showLogin && <Login/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/result' element={<Result/>} />
        <Route path='/buy' element={<BuyCredit/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
