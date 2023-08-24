import React from "react";
import logo from '../../logo.svg'

const styles = {
  logo: {
    height: '128px',
    width: '128px'
  }
}

export default function Header() {
  return (
    <header >
      <img src={logo} className="logo" alt="logo" style={styles.logo}/>
    </header>
  )
}