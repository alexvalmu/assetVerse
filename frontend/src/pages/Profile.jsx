import {useState, useEffect} from 'react';
import { FaSignInAlt} from 'react-icons/fa';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import AssetForm from "../components/AssetForm"
import AssetItem from "../components/AssetItem"
import {toast} from 'react-toastify';
import {getUserProfile, login,reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile(){
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth)
    const {assets,isLoading,isError, message} = useSelector((state) => state.assets)

    const [profileFetched, setProfileFetched] = useState(false);

    useEffect(() => {
      if (!user) {
        navigate('/login');
        return;
      }
    
      if (!profileFetched) {
        dispatch(getUserProfile());
        setProfileFetched(true);
      }
    
      return () => {
        dispatch(reset());
      };
    }, [user, dispatch, navigate, profileFetched]);
    
    if (isLoading) {
        return <Spinner />;
    }


    return (
        <>
            <section className="profile-container">
              {user && (
                <div className="user-card">
                  <button className="edit-button" onClick={() => navigate('/edit-profile')}>Edit ✎</button>
                  <div className="user-card-content">
                    <div className="user-icon">👤</div>
                    <h2 className="user-name">{user.name}</h2>
                    <p className="user-email"><strong>Email:</strong> {user.email}</p>
                    <p className="user-member">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </section>
        </>
    );
}

export default Profile;