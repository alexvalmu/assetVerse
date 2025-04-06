import { useDispatch } from "react-redux"
import { deleteAsset } from "../features/assets/assetSlice"
import { Link } from "react-router-dom";

function AssetItem({ asset }) {
  const dispatch = useDispatch()

  return (
    <div className="asset-item">
      {/* Botón eliminar */}
      <button 
        onClick={() => dispatch(deleteAsset(asset._id))} 
        className="close"
      >
        X
      </button>

      {/* Enlace al detalle del asset */}
      <Link to={`/assets/${asset._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          {new Date(asset.createdAt).toLocaleString('es-ES')}
        </div>
        <h2>{asset.text}</h2>
        <h2>{asset.desc}</h2>

        {/* Mostrar archivos adjuntos */}
        {asset.files && asset.files.length > 0 && (
          <div className="files-container">
            <h4>Archivos adjuntos:</h4>
            <ul>
              {asset.files.map((file, index) => (
                <li key={index}>
                  {file.filename}
                  <span> ({Math.round(file.size / 1024)} KB)</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Link>
    </div>
  )
}

export default AssetItem
