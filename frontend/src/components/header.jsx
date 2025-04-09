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
      
    
    <div>
    <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <ul className="menu-list">
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/categories'>Categories</Link></li>

        {user ? (
          <>
            <li><button className='btn' onClick={onLogout}>Logout</button></li>
            <li><Link to='/upload'>Upload</Link></li>
            <div className="search-bar"><input type="text" name="query" aria-label="Search"/><FaSearch className="search-icon" /></div>
            <span className='profile-icon'><Link to='/profile'><FaUser /></Link></span>

          </>
        ) : (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register'>Register</Link></li>
            <div className="search-bar"><input type="text" name="query" aria-label="Search"/><FaSearch className="search-icon" /></div>
            <span className='profile-icon'><Link to='/login'><FaUser /></Link></span>
          </>
          
        )
        }
      </ul>
      </div>
    </header>
  );
}

export default Header;
