import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">🔍</div>
        <span>CampusFind</span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/items" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
          Browse Items
        </NavLink>
        <NavLink to="/post" className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}>
          Report Item
        </NavLink>
      </div>

      <div className="navbar-actions">
        <Link to="/post" className="btn btn-primary btn-sm">
          + Report Item
        </Link>
      </div>
    </nav>
  );
}
