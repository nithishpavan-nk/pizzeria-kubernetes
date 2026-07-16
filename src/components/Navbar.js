import React, { useState } from 'react';
import Logo from '../assets/pizzaLogo.png';
import { Link, NavLink } from 'react-router-dom';
import ReorderIcon from '@mui/icons-material/Reorder';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCart } from '../context/CartContext';
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const { itemCount } = useCart();

  const toggleNavbar = () => {
    setOpenLinks((prev) => !prev);
  };

  const closeNavbar = () => {
    setOpenLinks(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className='navbar'>
      <div className='leftSide'>
        <Link to="/" onClick={closeNavbar} className="brandLink">
          <img src={Logo} alt="Nithish Pizzeria logo" />
          <span className="brandName">Nithish Pizzeria</span>
        </Link>
      </div>

      <div className='rightSide'>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? "navLink active" : "navLink"}
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/cart" className="cartLink" onClick={closeNavbar} aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}>
          <ShoppingCartIcon />
          {itemCount > 0 && <span className="cartBadge">{itemCount}</span>}
        </Link>
        <button
          className="navToggle"
          onClick={toggleNavbar}
          aria-label={openLinks ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={openLinks}
        >
          {openLinks ? <CloseIcon /> : <ReorderIcon />}
        </button>
      </div>

      <div className={`mobileMenu ${openLinks ? "open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeNavbar}
            className={({ isActive }) => isActive ? "navLink active" : "navLink"}
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/cart" className="navLink" onClick={closeNavbar}>
          Cart {itemCount > 0 && `(${itemCount})`}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
