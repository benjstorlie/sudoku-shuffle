import React from "react";
import logo from '../../logo.svg'

const styles = {
  logo: {
    height: '128px',
    width: '128px'
  }
}

export default function Footer() {
  return (
    <footer >
      <img src={logo} className="logo" alt="logo" style={styles.logo}/>
    </footer>
  )
}