import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {logout,reset} from '../features/auth/authSlice'

function Header() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.auth);

    const onLogout = ()=>{
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    }
  return (
    <header className='header'>
    <div className='logo'>
        <Link to='/'>AssetVerse</Link>
    </div>
    <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/categories'>Categories</Link></li>
       

        {user?(
            <>
            <li><button className='btn' onClick={onLogout}>Logout</button></li>
            <li><Link to='/profile'><FaUser /></Link></li>
            </>
        ) : (
          <>
            <li><Link to='/login'> Login/Register</Link></li>
            <li><Link to='/login'><FaUser /></Link></li>
          </>
        )}
        
      </ul>
</header>
  )
}

export default Header