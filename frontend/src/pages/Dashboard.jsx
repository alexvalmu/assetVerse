import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from "react-redux"
import AssetForm from "../components/AssetForm"
import Spinner from '../components/Spinner'
import { getAssets, reset } from "../features/assets/assetSlice"
function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const {assets,isLoading,isError, message} = useSelector((state) => state.assets)
  useEffect(() => {
    if(isError){
      console.log(message);
    }
    if (!user) {
      navigate("/login")
    }

    dispatch(getAssets());

    return () => {
      dispatch(reset())
    }
  }, [user, navigate,isError,message,dispatch])

  if (isLoading) {
    return <Spinner />
  }
  
  return (
    <>
      <section className="heading">
        <h1>Welcome {user&&user.name}</h1>
        <p>Assets dashboard</p>
      </section>
      <AssetForm></AssetForm>
    </>
  )
}

export default Dashboard