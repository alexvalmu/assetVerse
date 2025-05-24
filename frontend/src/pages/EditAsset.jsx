import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import AssetForm from "../components/AssetForm"
import Spinner from "../components/Spinner"
import { getAsset, reset } from "../features/assets/assetSlice"

function EditAsset() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.auth)
  const { asset, isLoading, isError, message } = useSelector((state) => state.assets)

  useEffect(() => {
    document.title = "AssetVerse | Editar Asset"
  }, [])

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    if (isError) {
      console.log(message)
    }

    dispatch(getAsset(id))

    return () => {
      dispatch(reset())
    }
  }, [user, isError, message, dispatch, navigate, id])

  if (isLoading || !asset) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>Edit Asset</h1>
      </section>
      <AssetForm asset={asset} mode="edit" />
    </>
  )
}

export default EditAsset
