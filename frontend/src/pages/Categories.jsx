import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAssets, getUserAssets, getAssetByTag, getAssetByCategory, reset } from "../features/assets/assetSlice";
import { getAssets, getUserAssets, getAssetByTag, reset } from "../features/assets/assetSlice"
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import AssetItem from '../components/AssetItem';
import { fetchCategories } from '../features/categories/categorySlice';
import { toast } from 'react-toastify';

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

  const { assets, isLoading, isError, message } = useSelector((state) => state.assets);
  const { categories, isLoadingCategories } = useSelector((state) => state.categories); // Obtener las categorías y su estado de carga

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // Actualizar la URL para reflejar la categoría seleccionada
    navigate(`?cat=${e.target.value}`);
  };
  useEffect(() => {
    dispatch(fetchCategories()); // Asegúrate de que esta acción esté bien definida en categorySlice
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
  
    if (userId) {
      dispatch(getUserAssets(userId)); // Buscar por usuario si existe
    } else if (tag) {
      dispatch(getAssetByTag(tag)); // Filtrar por tag si está presente
    } else if (cat) {
      // Aquí, buscamos por el nombre de la categoría en lugar del ID
      const category = categories.find((category) => category.name === cat);
      if (category) {
        dispatch(getAssetByCategory(category.name)); // Usamos el nombre de la categoría
      }
    } else {
      dispatch(getAssets()); // Si no hay tag ni categoría, obtener todos los assets
    }
  
    return () => {
      dispatch(reset());
    };
  }, [userId, tag, cat, isError, message, dispatch, categories]);
  


  useEffect(() => {
    const queryParams = new URLSearchParams();
  
    // Si hay una categoría seleccionada, establecemos el parámetro 'cat' con el nombre de la categoría
    if (selectedCategory) {
      queryParams.set('cat', selectedCategory); // Aseguramos que 'cat' sea el nombre de la categoría
    }
  
    // Si hay un tag, establecemos el parámetro 'tag'
    if (tag) {
      queryParams.set('tag', tag);
    }
  
    // Si hay tag o categoría, actualizamos la URL
    if (tag || selectedCategory) {
      navigate(`/categories?${queryParams.toString()}`);
    } else {
      navigate('/categories'); // Si no hay tag ni categoría, simplemente navegamos sin parámetros
    }
  }, [selectedCategory, tag, navigate]);
  

  if (isLoading || isLoadingCategories) {
    return <Spinner />;
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
        <div className="search-bar">
          <input
            type="text"
            name="query"
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
        <div>Categories</div>
        <section className="controls">
          <button onClick={() => setSortBy("nameAsc")}>A-Z</button>
          <button onClick={() => setSortBy("nameDesc")}>Z-A</button>
          <button onClick={() => setSortBy("recent")}>Recent</button>
        </section>

        <section className="filters">
          {/* Dropdown para seleccionar categoría */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Select category"
          >
            <option value="">All Categories</option>
            {categories && categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </section>
      </section>

      <section className="content">
        {sortedAssets.length > 0 ? (
          <div className="assets">  
            {Array.isArray(sortedAssets) &&
              sortedAssets.map((asset) => (
                <AssetItem key={asset._id} asset={asset} />
              ))}
          </div>
        ) : (
          <h3>No assets found</h3>
        )}
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
      </section>


    </>
  );

  
}

export default Categories;
