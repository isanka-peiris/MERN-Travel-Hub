import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">✈</span>
          <span className="navbar__brand-name">TravelHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav">
          <Link
            to="/"
            className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
          >
            Explore
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                className={`navbar__link ${isActive('/create') ? 'navbar__link--active' : ''}`}
              >
                + List Experience
              </Link>
              <div className="navbar__user-menu">
                <button
                  className="navbar__avatar-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="User menu"
                >
                  <span className="navbar__avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="navbar__username">{user.name}</span>
                  <span className={`navbar__chevron ${menuOpen ? 'navbar__chevron--open' : ''}`}>
                    ▾
                  </span>
                </button>

                {menuOpen && (
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-email">{user.email}</div>
                    <button
                      className="navbar__dropdown-item navbar__dropdown-item--danger"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar__auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm navbar__btn">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm navbar__btn">
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`navbar__ham-bar ${menuOpen ? 'navbar__ham-bar--open1' : ''}`} />
          <span className={`navbar__ham-bar ${menuOpen ? 'navbar__ham-bar--open2' : ''}`} />
          <span className={`navbar__ham-bar ${menuOpen ? 'navbar__ham-bar--open3' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/create" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                + List Experience
              </Link>
              <div className="navbar__mobile-divider" />
              <span className="navbar__mobile-user">👤 {user.name}</span>
              <button className="navbar__mobile-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
