import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AssetForm from "../components/AssetForm";
import AssetItem from "../components/AssetItem";
import { toast } from 'react-toastify';
import { getUserProfile, reset as resetAuth } from '../features/auth/authSlice';
import { getAssets, reset as resetAssets, getUserAssets, deleteAsset } from '../features/assets/assetSlice';
import Spinner from '../components/Spinner';
import '../profile.css';
import { FaRegTrashAlt , FaRegEdit  } from 'react-icons/fa';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: assetId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { assets, userAssets, isLoading } = useSelector((state) => state.assets);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    document.title = "AssetVerse | Profile";
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!profileFetched) {
      dispatch(getUserProfile());
      dispatch(getUserAssets(user._id));
      dispatch(getAssets());
      setProfileFetched(true);
    }
  }, [user, dispatch, navigate, profileFetched]);

  useEffect(() => {
    return () => {
      dispatch(resetAuth());
    };
  }, [dispatch]);

  const handleDelete = async (assetId) => {
    try {
      await dispatch(deleteAsset(assetId)).unwrap();
      
      dispatch(getUserAssets(user._id));
      dispatch(getUserProfile());
        dispatch(getAssets());
        window.location.reload();
    } catch (error) {
      toast.error('Error al eliminar el asset');
    }
  };

  const handleEdit = (assetId) => {
    navigate(`/edit/${assetId}`);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container-perfil">
      <section className="perfil">
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

      <section className="assets-perfil">
        <section className="assets-section">
          <h2 className="assets-title">Uploads</h2>
          {userAssets.length > 0 ? (
            <div className="assets-grid">
              {userAssets.map((asset) => (
                <div key={asset._id} className="asset-item">
                  <button
                    className="close-btn"
                    onClick={() => {
                      if (window.confirm('Do you really want to delete this asset?')) {
                        handleDelete(asset._id);
                      }
                    }}
                    aria-label="Delete asset"
                  >
                     <FaRegTrashAlt  />
                  </button>
                  <button className="edit-btn" onClick={() =>handleEdit(asset._id)}><FaRegEdit /></button>
                  <AssetItem asset={asset} />
                </div>
              ))}
            </div>
          ) : (
            <p className="no-assets">You haven't uploaded assets yet</p>
          )}
        </section>

        <section className="favorites-section">
          <h2>Favorites</h2>
          {user && user.favorites?.length > 0 ? (
            <div className="assets-grid">
              {assets
                .filter(asset => asset && user.favorites.includes(asset._id))
                .map((asset) => (
                  <AssetItem key={asset._id} asset={asset} />
                ))}
            </div>
          ) : (
            <p className="no-assets">You don't have favorites yet.</p>
          )}
        </section>
      </section>
    </div>
  );
}

export default Profile;
