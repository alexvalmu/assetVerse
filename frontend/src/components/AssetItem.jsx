import { useDispatch } from "react-redux";
import { deleteAsset } from "../features/assets/assetSlice";
import { Link } from "react-router-dom";
import StarsRating from "./StarsRating";
import TagList from "./TagList";
import { use } from "react";
import { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { getUserById } from "../features/users/userSlice";
import userService from "../features/users/userService";

function AssetItem({ asset }) {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (asset.user) {
        setIsLoadingUser(true);
        try {
          const fetchedUser = await userService.getUserById(asset.user);
          setUser(fetchedUser);
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setIsLoadingUser(false);
        }
      }
    };
    fetchUser();
  }, [asset.user]);

  return (
    <div className="asset-item">
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

        <h2>{asset.title}</h2>

        <div className="asset-user">
          {isLoadingUser ? (
            <p>Loading user...</p>
          ) : (
            user && <p>Uploaded by {user.name}</p>
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