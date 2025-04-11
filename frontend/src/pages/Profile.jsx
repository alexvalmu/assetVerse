import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import AssetForm from "../components/AssetForm"
import AssetItem from "../components/AssetItem"
import {toast} from 'react-toastify';
import { getUserProfile, reset as resetAuth } from '../features/auth/authSlice';
import { getAssets, reset as resetAssets } from '../features/assets/assetSlice';
import Spinner from '../components/Spinner';
import { getUserAssets, deleteAsset } from '../features/assets/assetSlice';


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
        dispatch(getUserAssets(user._id));
        setProfileFetched(true);
      }
    }, [user, dispatch, navigate, profileFetched]);

    useEffect(() => {
      return () => {
        dispatch(resetAuth());
      };
    }, [dispatch]);
    
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
        <div className="container-perfil">
            <section className="profile">
              {user && (
                <div className="user-card">
                  <button onClick={() => navigate('/edit-profile')}>Edit ✎</button>
                  <div>
                    <div className="user-icon">👤</div>
                    <h2 className="user-name">{user.name}</h2>
                    <p className="user-email"><strong>Email:</strong> {user.email}</p>
                    <p className="user-member">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="assets-section">
              <h2 className="assets-title">Uploads</h2>
              {assets.length > 0 ? (
                <div className="assets-grid">
                  {assets.map((asset) => (
                   <div key={asset._id} className="asset-item">
                      <button className="close-btn" onClick={() => dispatch(deleteAsset(asset._id))}>X</button>
                      <AssetItem asset={asset} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-assets">Aún no has creado ningún asset.</p>
              )}
            </section>
            </div>
        </>
    );
}

export default Profile;