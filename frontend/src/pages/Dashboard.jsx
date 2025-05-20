import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import AssetItem from "../components/AssetItem"
import Spinner from '../components/Spinner'
import { getAssets, reset } from "../features/assets/assetSlice"

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sortBy, setSortBy] = useState("recent");
  const { assets, isLoading, isError, message } = useSelector((state) => state.assets)

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getAssets());
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, navigate]);

  if (isLoading) {
    return <Spinner />
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
        <div className="buttons">
          <div className="filters">
            <button onClick={() => navigate('/categories')}>Todos</button>
            <button onClick={() => navigate('/categories?cat=3D')}>3Ds</button>
            <button onClick={() => navigate('/categories?cat=2D')}>2Ds</button>
            <button onClick={() => navigate('/categories?cat=Audio')}>Audio</button>
            <button onClick={() => navigate('/categories?cat=Code')}>Code</button>
          </div>
          <div className="controls">
            <button onClick={() => setSortBy("nameAsc")}>A-Z</button>
            <button onClick={() => setSortBy("nameDesc")}>Z-A</button>
            <button onClick={() => setSortBy("recent")}>Recent</button>
          </div>
        </div>
        <h2>All Assets</h2>
      </section>

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
    </>
  )
}

export default Dashboard