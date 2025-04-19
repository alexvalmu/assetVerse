import { useEffect, useState } from "react";
import { FaHeart, FaDownload } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from '../components/Spinner';
import { getAsset, reset } from "../features/assets/assetSlice";
import { getUserById } from "../features/users/userSlice";
import { Link } from "react-router-dom";
import StarsRating from "../components/StarsRating";
import { getAssetComments } from "../features/comments/commentSlice";
import CommentItem from "../components/CommentItem";
function SingleAsset() {
    const { id: assetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { asset, isLoading, isError, message } = useSelector((state) => state.assets);
    const { viewedUser, isLoading: userLoading } = useSelector((state) => state.users);
    const { comments, isLoading: commentsLoading } = useSelector((state) => state.comments); 
    const [mainPreview, setMainPreview] = useState('');

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (assetId) {
            dispatch(getAsset(assetId));
            dispatch(getAssetComments(assetId)); // Fetch comments for the asset
        }

        return () => {
            dispatch(reset());
        };
    }, [dispatch, assetId, isError, message]);

    useEffect(() => {
        if (asset && asset.mainImage?.[0]?.filename) {
            setMainPreview(`http://localhost:5000/uploads/${asset.mainImage[0].filename}`);
        }

        if (asset?.user) {
            dispatch(getUserById(asset.user));
        }
    }, [asset, dispatch]);

   

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="single-asset">
            {/* Imagen principal */}
            <div className="mostrando">
                {mainPreview && (
                    <img
                        src={mainPreview}
                        className="mainImage"
                        alt="Imagen principal"
                    />
                )}
            </div>

            {/* Miniaturas */}
            <div className="miniaturas">
                {asset.mainImage && asset.mainImage.map((img, index) => (
                    <img
                        key={`main-${index}`}
                        src={`http://localhost:5000/uploads/${img.filename}`}
                        alt={`Miniatura ${index}`}
                        className="miniatura"
                        style={{ border: mainPreview.includes(img.filename) ? '2px solid #007bff' : '1px solid #ccc' }}
                        onClick={() => setMainPreview(`http://localhost:5000/uploads/${img.filename}`)}
                    />
                ))}

                {asset.files && asset.files.map((file, index) => (
                    file.mimetype.startsWith('image/') && (
                        <img
                            key={`file-${index}`}
                            src={`http://localhost:5000/uploads/${file.filename}`}
                            alt={file.filename}
                            className="miniatura"
                            style={{ border: mainPreview.includes(file.filename) ? '2px solid #007bff' : '1px solid #ccc' }}
                            onClick={() => setMainPreview(`http://localhost:5000/uploads/${file.filename}`)}
                        />
                    )
                ))}
            </div>

            {/* Detalles del asset */}
            <div className="asset-details">
                <h2>{asset?.title}</h2>
                <p>{asset?.desc}</p>
                <Link to={`/categories?user=${asset.user}`} >{viewedUser?.name}</Link>
                {asset?.ratingAverage !== undefined && (
                    <div className="asset-rating">
                        <p>{comments.length}</p>
                        <StarsRating rating={asset.ratingAverage} />
                    </div>
                )}
                 {/* Comentarios */}
            <div className="comments-section">
                <h3>Comentarios</h3>
                {/* Aquí puedes mapear y mostrar los comentarios del asset */}
                {comments.map(comment => (
                    <CommentItem key={comment._id} comment={comment} />
                ))}
            </div>
            </div>
            <div className="botones-guardado">
                <button className="btn btn-primary"><FaHeart></FaHeart></button>
                <button className="btn btn-secondary"><FaDownload></FaDownload></button>
            </div>

           

        </div>
    );
}

export default SingleAsset;
