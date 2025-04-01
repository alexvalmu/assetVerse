import { useDispatch } from "react-redux"
import { deleteAsset } from "../features/assets/assetSlice"
function AssetItem({asset}) {
  const dispatch = useDispatch()
  return (
    <div className="goal">
        <div>
            {new Date(asset.createdAt).toLocaleString('es-ES')}
        </div>
        <h2>{asset.text}</h2>
        <button onClick={()=>dispatch(deleteAsset(asset._id))} className="close">X</button>
    </div>
  )
}

export default AssetItem