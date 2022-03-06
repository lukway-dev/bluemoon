import React from 'react'
import Logo from '../components/Logo'
import Navbar from '../components/Navbar'
import '../styles/containers/Header.sass'

const Header = () => {
  return (
    <header className='Header'>
      <Logo/>
      <Navbar/>
    </header>
  )
}

export default Header