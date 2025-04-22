import { useDispatch } from "react-redux";
import { deleteAsset } from "../features/assets/assetSlice";
import { Link } from "react-router-dom";
import StarsRating from "./StarsRating";

function AssetItem({ asset }) {
  const dispatch = useDispatch();

  return (
    <div className="asset-item">
      <button
        onClick={() => dispatch(deleteAsset(asset._id))}
        className="close"
      >
        X
      </button>

      <Link to={`/assets/${asset._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          {new Date(asset.createdAt).toLocaleString('es-ES')}
        </div>
        <h2>{asset.text}</h2>
        <h2>{asset.desc}</h2>
        
        {/* Mostrar tags */}
          {asset.tags && asset.tags.length > 0 && (
          <div className="asset-tags">
            <h4>Tags:</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {asset.tags.map((tag, index) => (
                <li key={index} style={{ background: '#E5A0A0', padding: '0.3rem 0.6rem', borderRadius: '12px' }}>
                  #{tag.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mostrar archivos adjuntos */}
        {asset.files && asset.files.length > 0 && (
          <div className="files-container">
            <h4>Archivos adjuntos:</h4>
            <ul>
              {asset.files.map((file, index) => (
                <li key={index}>
                  {file.mimetype.startsWith('image/') ? (
                    <img
                      src={`http://localhost:5000/uploads/${file.filename}`}
                      alt={file.filename}
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  ) : (
                    <span>
                      {file.filename} ({Math.round(file.size / 1024)} KB)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Link>
      {asset?.ratingAverage !== undefined && (
    <div className="asset-rating">
        <p>{asset.ratingAverage.toFixed(1)} &#9733;</p>
    </div>
)}
    </div>
  );
}

export default AssetItem;