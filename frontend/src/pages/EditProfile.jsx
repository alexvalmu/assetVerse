import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserProfile, getUserProfile ,reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function EditProfile() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    document.title = "AssetVerse | Edit Profile"; 
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user, navigate]);
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData))
      .unwrap()
      .then(() => {
        toast.success('Perfil actualizado');
        navigate('/profile');
      })
      .catch((error) => {
        toast.error('Error al actualizar: ' + error);
      });
  };
  
  if (isLoading) return <Spinner />;

  return (
    <section className="edit-profile">
      <h1 className="no-assets">Edit Profile</h1>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label for="email">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
}

export default EditProfile;
