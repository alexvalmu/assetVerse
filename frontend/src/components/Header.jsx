import { FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
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
const handleLinkClick = () => {
  setIsMenuOpen(false);
};
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }
      navigate(`/categories?${params.toString()}`);
      setSearchQuery(''); // Limpiar el campo de búsqueda después de enviar
      setIsMenuOpen(false);
    }
     
  };

  return (
    <header  className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className='logo'>
        <Link to='/'>AssetVerse</Link>
      </div>

      <div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className="menu-list">
          <li><Link to='/' onClick={handleLinkClick} className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to='/categories' onClick={handleLinkClick} className={location.pathname === '/categories' ? 'active' : ''}>Categories</Link></li>

{user ? (
  <>
    <li><button className='btn' onClick={() => { onLogout(); handleLinkClick(); }}>Logout</button></li>
    <li><Link to='/upload' onClick={handleLinkClick} className={location.pathname === '/upload' ? 'active' : ''}>Upload</Link></li>
    
    {location.pathname !== '/categories' && (
      <li className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          placeholder="Search"
          aria-label="Search"
        />
        <FaSearch className="search-icon" />
      </li>
    )}

    <li className='profile-icon'>
      <Link aria-label="Profile icon" onClick={handleLinkClick} to='/profile'><FaUser /></Link>
    </li>
  </>
) : (
  <>
    <li><Link to='/login' onClick={handleLinkClick} className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
    <li><Link to='/register' onClick={handleLinkClick} className={location.pathname === '/register' ? 'active' : ''}>Register</Link></li>
    
    {location.pathname !== '/categories' && (
      <li className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          placeholder="Search assets"
          aria-label="Search"
        />
        <FaSearch className="search-icon" />
      </li>
    )}

    <li className='profile-icon'>
      <Link aria-label="Profile icon" onClick={handleLinkClick} to='/login'><FaUser /></Link>
    </li>
  </>
)}

        </ul>
      </div>
    </header>
  );
}

export default Header;
