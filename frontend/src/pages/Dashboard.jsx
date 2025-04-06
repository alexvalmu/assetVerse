import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from "react-redux"
import AssetItem from "../components/AssetItem"
import Spinner from '../components/Spinner'
import { getAssets, reset } from "../features/assets/assetSlice"

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [sortBy, setSortBy] = useState("recent");
  const {assets,isLoading,isError, message} = useSelector((state) => state.assets)
  useEffect(() => {
    if (isError) {
      console.log(message);
    }
  
  
    dispatch(getAssets());
  
    return () => {
      dispatch(reset());
    };
  }, [ isError, message, dispatch, navigate]); 

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
        <h2>Recently Added</h2>
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
      </section>
      
      <section className="content">
        {sortedAssets.length > 0 ? (
          <div className="assets">
            {sortedAssets.map((asset) => (
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