import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAssets, getUserAssets, getAssetByTag, getAssetByCategory, reset } from "../features/assets/assetSlice";
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import AssetItem from '../components/AssetItem';
import { fetchCategories } from '../features/categories/categorySlice';
import { toast } from 'react-toastify';
import { getTags } from "../features/tags/tagSlice";

function Categories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('user');
  const tag = searchParams.get('tag');
  const cat = searchParams.get('cat');

  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(cat || ""); // Manejar la categoría seleccionada
  const [selectedTag, setSelectedTag] = useState(tag || "");

  const { assets, isLoading, isError, message } = useSelector((state) => state.assets);
  const { categories, isLoadingCategories } = useSelector((state) => state.categories); // Obtener las categorías y su estado de carga
  const { tags } = useSelector((state) => state.tags);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    navigate(`?cat=${e.target.value}`);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    navigate(`?tag=${e.target.value}`);
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getTags());
  }, [dispatch]);

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoriesLoaded(true);
    }
  }, [categories]);


  useEffect(() => {
    if (!categoriesLoaded) return;

    if (userId) {
      dispatch(getUserAssets(userId));
    } else if (tag) {
      dispatch(getAssetByTag(tag));
    }else if (selectedTag) {
      dispatch(getAssetByTag(selectedTag));
    } else if (cat) {
      const category = categories.find((c) => c.name.toLowerCase() === cat.toLowerCase());
      if (category) {
        dispatch(getAssetByCategory(category.name));
      } else {
        toast.warning("Categoría no encontrada.");
      }
    } else {
      dispatch(getAssets());
    }

    return () => {
      dispatch(reset());
    };
  }, [userId, tag, selectedTag, cat, categoriesLoaded, dispatch]);




  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (selectedCategory) {
      queryParams.set('cat', selectedCategory);
    }

    if (tag) {
      queryParams.set('tag', tag);
    }

    if (selectedTag) {
      queryParams.set('tag', selectedTag);
    }

    if (tag || selectedCategory || selectedTag) {
      navigate(`/categories?${queryParams.toString()}`);
    } else {
      navigate('/categories');
    }
  }, [selectedCategory, selectedTag, tag, navigate]);


  if (isLoading || isLoadingCategories) {
    return <Spinner />;
  }

  let sortedAssets = [...assets];

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
        <div className="search-bar large"> <input
          type="text"
          name="query"
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearch}
        /><FaSearch className="search-icon" /></div>
        <div className="buttons">
          <section className="filters">
            {/* Dropdown para seleccionar categoría */}
            <div className="category-list">
              <button
                className={!selectedCategory ? "active" : ""}
                onClick={() => handleCategoryChange({ target: { value: "" } })}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={selectedCategory === category.name ? "active" : ""}
                  onClick={() => handleCategoryChange({ target: { value: category.name } })}
                >
                  {category.name}
                </button>
              ))}
            </div>
                        {/* Dropdown para seleccionar tag */}
          <select
            value={selectedTag}
            onChange={handleTagChange}
            aria-label="Select tag"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          </section>
          <section className="controls">
            <button onClick={() => setSortBy("nameAsc")}>A-Z</button>
            <button onClick={() => setSortBy("nameDesc")}>Z-A</button>
            <button onClick={() => setSortBy("recent")}>Recent</button>
          </section>


        </div>

      </section>

      <section className="content">
        {sortedAssets.length > 0 ? (
          <div className="assets">
            {sortedAssets.map((asset) => (
              <AssetItem key={asset._id} asset={asset} />
            ))}
          </div>
        ) : selectedCategory ? (
          <h3>No assets found in the category "{selectedCategory}"</h3>
        ) : (
          <h3>No assets found</h3>
        )}
      </section>
    </>
  );
}

export default Categories;
