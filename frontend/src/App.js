import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import SingleAsset from './pages/SingleAsset';
import EditProfile from './pages/EditProfile';
import Categories from './pages/Categories';

import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "AssetVerse";
  }, []);
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/assets/:id" element={<SingleAsset />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories?user=userId" element={<Categories />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
