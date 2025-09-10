import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { Toaster } from 'react-hot-toast'
function App() {

  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <Toaster position='top-right' reverseOrder={false}/>
    </>
  )
}

export default App
