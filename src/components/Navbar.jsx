import React from 'react'
import '../styles/components/Navbar.sass'

const Navbar = () => {
  return (
    <nav className='Navbar'>
      <a className='Navbar__Button' href="">ABOUT</a>
      <a className='Navbar__Button' href="">FEEDBACK</a>
      <a className='Navbar__Button' href="">CONTACT</a>
      <button className='Navbar__Button'>
        <img className='Navbar__SearchIcon' src='./bluemoon/assets/lupa.svg'/>
      </button>
      <a className='Navbar__Button--Special' href="">CONNECT WALLET</a>
    </nav>
  )
}

export default Navbar