import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from "react-redux"
import AssetItem from "../components/AssetItem"
import Spinner from '../components/Spinner'
import { getAssets, reset } from "../features/assets/assetSlice"

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
  
  return (
    <>
      <section className="heading">
        <h2>Recently Added</h2>
      </section>
      <section className="content">
        {assets.length > 0 ? (
          <div className="assets">
            {assets.map((asset) => (
              <AssetItem key={asset._id} asset={asset} />
            ))}
          </div>
        ):(<h3>No assets found</h3>)
        }
      </section>
    </>
  )
}

export default Dashboard