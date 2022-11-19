import { Children } from 'react';
import logo from '../images/logo.svg';

function Header({ children }) {
  return (
    <header className="header">
      <img src={logo} alt="Around the U.S. logo" className="logo" />
      {children}
    </header>
  );
}

export default Header;
