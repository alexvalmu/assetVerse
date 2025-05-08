import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AssetForm from "../components/AssetForm";
import AssetItem from "../components/AssetItem";
import { toast } from 'react-toastify';
import { getUserProfile, reset as resetAuth } from '../features/auth/authSlice';
import { getAssets, reset as resetAssets, getUserAssets, deleteAsset } from '../features/assets/assetSlice';
import Spinner from '../components/Spinner';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { assets, userAssets, isLoading } = useSelector((state) => state.assets);
  const [profileFetched, setProfileFetched] = useState(false);

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
    } catch (error) {
      toast.error('Error al eliminar el asset');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
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

      <section className="assets-perfil">
        <section className="assets-section">
          <h2 className="assets-title">Uploads</h2>
          {userAssets.length > 0 ? (
            <div className="assets-grid">
              {userAssets.map((asset) => (
                <div key={asset._id} className="asset-item">
                  <button className="close-btn" onClick={() => handleDelete(asset._id)}>X</button>
                  <AssetItem asset={asset} />
                </div>
              ))}
            </div>
          ) : (
            <p className="no-assets">Aún no has creado ningún asset.</p>
          )}
        </section>

        <section className="favorites-section">
          <h2>Favoritos</h2>
          {user && user.favorites?.length > 0 ? (
            <div className="assets-grid">
              {assets
                .filter(asset => asset && user.favorites.includes(asset._id))
                .map((asset) => (
                  <AssetItem key={asset._id} asset={asset} />
                ))}
            </div>
          ) : (
            <p>No tienes assets favoritos aún.</p>
          )}
        </section>
      </section>
    </div>
  );
}

export default Profile;
