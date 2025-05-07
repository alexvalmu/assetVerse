import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAssets, getUserAssets, getAssetByTag, reset } from "../features/assets/assetSlice"
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import AssetItem from '../components/AssetItem';
import { toast } from 'react-toastify';
import { fetchCategories } from '../features/categories/categorySlice';

function Categories() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const { categories } = useSelector((state) => state.categories);

  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('user');
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const { assets, isLoading, isError, message } = useSelector((state) => state.assets)
  const tag = searchParams.get('tag');
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    console.log(userId);

    if (userId) {
      dispatch(getUserAssets(userId)); // <-- pasamos el userId
    } else {
      dispatch(getAssets());
    }

    if (tag) {
      dispatch(getAssetByTag(tag)); // <-- pasamos el userId
    } else {
      dispatch(getAssets());
    }
    dispatch(fetchCategories());
    return () => {
      dispatch(reset());
    };
  }, [userId, isError, message, dispatch, navigate]);

  if (isLoading) {
    return <Spinner />
  }
  let sortedAssets = [...assets]; // copia para no mutar el estado original

  if (sortBy === "nameAsc") {
    sortedAssets.sort((a, b) => {
      const nameA = a.text || "";
      const nameB = b.text || "";
      return nameA.localeCompare(nameB);
    });
  } else if (sortBy === "nameDesc") {
    sortedAssets.sort((a, b) => {
      const nameA = a.text || "";
      const nameB = b.text || "";
      return nameB.localeCompare(nameA);
    });
  } else if (sortBy === "recent") {
    sortedAssets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  return (
    <>
      <section className="heading">
        <div className="search-bar large"><input type="text" name="query" aria-label="Search" /><FaSearch className="search-icon" /></div>
        <div className="buttons">
          <section className="filters">
            <button >Todos</button>
            <button >3Ds</button>
            <button >2Ds</button>
            <button >Audio</button>
            <button >Script</button>
          </section>
          <section className="controls">
            <button onClick={() => setSortBy("nameAsc")}>A-Z</button>
            <button onClick={() => setSortBy("nameDesc")}>Z-A</button>
            <button onClick={() => setSortBy("recent")}>Recent</button>
          </section>


        </div>

      </section>
      <section className='categories-container'>
        {categories && categories.length > 0 ? (
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category._id}>
                <button onClick={() => dispatch(getAssetByTag(category.name))}>
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories available</p>
        )}
         <section className="content">
          {sortedAssets.length > 0 ? (
            <div className="assets">
              {Array.isArray(sortedAssets) && sortedAssets.map((asset) => (
                <AssetItem key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <h3>No assets found</h3>
          )}
      </section>
      </section>
     


    </>

  )
}

export default Categories