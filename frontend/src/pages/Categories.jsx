import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAssets, getUserAssets, getAssetByTag, getAssetByCategory, getAssetsFiltered, reset } from "../features/assets/assetSlice";
import { getAllUsers } from '../features/users/userSlice';
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
  const search = searchParams.get('search');

  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [selectedCategory, setSelectedCategory] = useState(cat || ""); // Manejar la categoría seleccionada
  const [selectedTag, setSelectedTag] = useState(tag || "");
  const [selectedUser, setSelectedUser] = useState(userId || "");


  const { assets, isLoading, isError, message } = useSelector((state) => state.assets);
  const { categories, isLoadingCategories } = useSelector((state) => state.categories); // Obtener las categorías y su estado de carga
  const { tags } = useSelector((state) => state.tags);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    document.title = "AssetVerse | Categories"; 
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSelectedUser(searchParams.get("user") || "");
    setSelectedTag(searchParams.get("tag") || "");
    setSelectedCategory(searchParams.get("cat") || "");
    setSearchQuery(searchParams.get("search") || "");
  }, [location.search]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Actualiza el valor mientras el usuario escribe
  };

 const buscar = () => {
  dispatch(getAssetsFiltered({
    searchQuery: searchQuery,
    userId: selectedUser || null,
    tag: selectedTag || null,
    category: selectedCategory || null
  }));
};
const handleSearchKeyPress = (e) => {
  if (e.key === 'Enter') {
    buscar();
  }
};

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    navigate(`?cat=${e.target.value}`);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    navigate(`?tag=${e.target.value}`);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    navigate(`?user=${e.target.value}`);
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getTags());
    dispatch(getAllUsers());
  }, [dispatch]);

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoriesLoaded(true);
    }
  }, [categories]);


  useEffect(() => {
    if (!categoriesLoaded) return;

    // Enviar searchQuery al backend junto con los demás filtros
    dispatch(getAssetsFiltered({
      userId: selectedUser || null,
      tag: selectedTag || null,
      category: selectedCategory || null,
      searchQuery: searchQuery || ""  // Incluir searchQuery en la solicitud
    }));

    return () => {
      dispatch(reset());
    };
  }, [selectedUser, selectedTag, selectedCategory, categoriesLoaded, dispatch]);





  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (selectedCategory) {
      queryParams.set('cat', selectedCategory);
    }
    if (selectedUser) {
      queryParams.set('user', selectedUser);
    }


    if (selectedTag) {
      queryParams.set('tag', selectedTag);
    }

    if (selectedCategory || selectedTag || selectedUser) {
      navigate(`/categories?${queryParams.toString()}`);
    } else {
      navigate('/categories');
    }
  }, [selectedCategory, selectedUser, selectedTag, navigate]);


  if (isLoading || isLoadingCategories) {
    return <Spinner />;
  }

 let sortedAssets = [...assets];

  if (sortBy === "nameAsc") {
    sortedAssets.sort((a, b) => {
      const nameA = a.title || "";
      const nameB = b.title || "";
      return nameA.localeCompare(nameB);
    });
  } else if (sortBy === "nameDesc") {
    sortedAssets.sort((a, b) => {
      const nameA = a.title || "";
      const nameB = b.title || "";
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchKeyPress} // Ejecuta la búsqueda al presionar Enter
          placeholder="Search assets"
          /><FaSearch className="search-icon"  onClick={buscar}/>
        </div>
        <div className="buttons">
          <section className="filters">
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
            {/* Dropdown para seleccionar user */}
            <select
              value={selectedUser}
              onChange={handleUserChange}
              aria-label="Select user"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </section>
          <div className="controls">
            <button
              className={sortBy === 'nameAsc' ? 'active' : ''}
              onClick={() => setSortBy('nameAsc')}
            >A-Z</button>
            <button
              className={sortBy === 'nameDesc' ? 'active' : ''}
              onClick={() => setSortBy('nameDesc')}
            >Z-A</button>
            <button
              className={sortBy === 'recent' ? 'active' : ''}
              onClick={() => setSortBy('recent')}
            >Recent</button>
           
          </div>
        </div>
      </section>

      <div className="grid-categorias">
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

        <section className="content">
          {sortedAssets.length > 0 ? (
            <div className="assets">
              {sortedAssets.map((asset) => (
                <AssetItem key={asset._id} asset={asset} />
              ))}
            </div>
          ) : (
            <h3 className='no-assets'>No assets found</h3>
          )}
        </section>
      </div>
    </>
  );
}

export default Categories;
