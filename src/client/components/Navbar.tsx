import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'is-active' : '';
  };

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <strong>Docker Web Manager</strong>
        </Link>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <Link className={`navbar-item ${isActive('/')}`} to="/">
            Dashboard
          </Link>
          <Link className={`navbar-item ${isActive('/containers')}`} to="/containers">
            Containers
          </Link>
          <Link className={`navbar-item ${isActive('/images')}`} to="/images">
            Images
          </Link>
          <Link className={`navbar-item ${isActive('/volumes')}`} to="/volumes">
            Volumes
          </Link>
          <Link className={`navbar-item ${isActive('/networks')}`} to="/networks">
            Networks
          </Link>
          <Link className={`navbar-item ${isActive('/settings')}`} to="/settings">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};
