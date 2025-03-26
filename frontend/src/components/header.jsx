import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className='logo'>
        <Link to='/'>AssetVerse</Link>
      </div>
      
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/categories'>Categories</Link></li>

        {user ? (
          <>
            <li><button className='btn' onClick={onLogout}>Logout</button></li>
            <div className="search-bar"><input type="text" name="query" aria-label="Search"/><FaSearch className="search-icon" /></div>
            <li><Link to='/profile'><FaUser /></Link></li>
          </>
        ) : (
          <>
            <li><Link to='/login'>Login/Register</Link></li>
            <div className="search-bar"><input type="text" name="query" aria-label="Search"/><FaSearch className="search-icon" /></div>
            <li><Link to='/login'><FaUser /></Link></li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
