import { useDispatch } from "react-redux";
import { deleteAsset } from "../features/assets/assetSlice";
import { Link } from "react-router-dom";
import StarsRating from "./StarsRating";
import TagList from "./TagList";

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
        <TagList tags={asset?.tags} />

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