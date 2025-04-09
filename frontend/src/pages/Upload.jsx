import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from "react-redux"
import AssetForm from "../components/AssetForm"
import AssetItem from "../components/AssetItem"
import Spinner from '../components/Spinner'
import { getAssets, reset } from "../features/assets/assetSlice"

function Upload() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const {assets,isLoading,isError, message} = useSelector((state) => state.assets)
  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
      return; // Detener la ejecución aquí
    }

    dispatch(getAssets());

    return () => {
      dispatch(reset());
    };
}, [user, isError, message, dispatch, navigate]); 

if (isLoading) {
  return <Spinner />
}

return (
    <>
      <section className="heading">
     
      </section>
      <AssetForm></AssetForm>
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

export default Upload