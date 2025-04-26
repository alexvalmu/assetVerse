import { useDispatch } from "react-redux";
import { deleteAsset } from "../features/assets/assetSlice";
import { Link } from "react-router-dom";
import StarsRating from "./StarsRating";
import TagList from "./TagList";
import { use } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserById } from "../features/users/userSlice";
function AssetItem({ asset }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(asset.user){
      dispatch(getUserById(asset.user));
    }
  }
  , [asset.user, dispatch]);
  const user = useSelector((state) => state.users.viewedUser);
  return (
    <div className="asset-item">
      {/* <button
        onClick={() => dispatch(deleteAsset(asset._id))}
        className="close"
      >
        X
      </button> */}

      <Link to={`/assets/${asset._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="main-image">
          {asset.mainImage && asset.mainImage.length > 0 && (
            <img
              src={`http://localhost:5000/uploads/${asset.mainImage[0].filename}`}
              alt="Asset"
              className="asset-image"
            />
          )}
        </div>

        {/* <div>
          {new Date(asset.createdAt).toLocaleString('es-ES')}
        </div> */}
        <h2>{asset.title}</h2>
        
        <div className="asset-user">
          {user  && (
            <p >{/* Link to user profile */}
              Uploaded by {user.name}
            </p>
          )}       
       </div>
       
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