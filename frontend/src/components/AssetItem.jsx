import { useDispatch } from "react-redux"
import { deleteAsset } from "../features/assets/assetSlice"

function AssetItem({ asset }) {
  const dispatch = useDispatch()

  return (
    <div className="goal">
        <div>
            {new Date(asset.createdAt).toLocaleString('es-ES')}
        </div>
        <h2>{asset.text}</h2>
        
        {/* Mostrar archivos adjuntos */}
        {asset.files && asset.files.length > 0 && (
            <div className="files-container">
                <h4>Archivos adjuntos:</h4>
                <ul>
                    {asset.files.map((file, index) => (
                        <li key={index}>
                            <a 
                                href={`http://localhost:5000/${file.path}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {file.filename}
                            </a>
                            <span> ({Math.round(file.size / 1024)} KB)</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <button 
            onClick={() => dispatch(deleteAsset(asset._id))} 
            className="close"
        >
            X
        </button>
    </div>
  )
}

export default AssetItem