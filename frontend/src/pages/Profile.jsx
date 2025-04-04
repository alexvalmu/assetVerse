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

    useEffect(() => {
      if (isError) {
        console.log(message);
      }
    
      if (!user) {
        navigate("/login");
        return;
      }
    
      dispatch(getUserProfile());
          return () => {
            dispatch(reset());
          };

    }, [user, isError, message, dispatch, navigate]); 
    if (isLoading) {
        return <Spinner />;
    }


    return (
        <>
            <Header />
            <section className="profile-container">
                <h1>Profile</h1>
                {user ? (
                    <div className="profile-info">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>No user data found.</p>
                )}
            </section>
            <Footer />
        </>
    );
}

export default Profile;