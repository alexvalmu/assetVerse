import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }
      navigate(`/categories?${params.toString()}`);
      setSearchQuery(''); // Limpiar el campo de búsqueda después de enviar
    }
  };

  return (
    <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className='logo'>
        <Link to='/'>AssetVerse</Link>
      </div>

      <div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className="menu-list">
          <li><Link to='/' className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to='/categories' className={location.pathname === '/categories' ? 'active' : ''}>Categories</Link></li>

          {user ? (
            <>
              <li><button className='btn' onClick={onLogout}>Logout</button></li>
              <li><Link to='/upload' className={location.pathname === '/upload' ? 'active' : ''}>Upload</Link></li>
              {location.pathname !== '/categories' && (
                <div className="search-bar">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <FaSearch className="search-icon" />
                </div>
              )}

              <span className='profile-icon'><Link to='/profile'><FaUser /></Link></span>
            </>
          ) : (
            <>
              <li><Link to='/login' className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
              <li><Link to='/register' className={location.pathname === '/register' ? 'active' : ''}>Register</Link></li>
              {location.pathname !== '/categories' && (
                <div className="search-bar">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search assets..."
                    aria-label="Search"
                  />
                  <FaSearch className="search-icon" />
                </div>
              )}

              <span className='profile-icon'><Link to='/login'><FaUser /></Link></span>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
