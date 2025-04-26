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
import { addFavorite, removeFavorite } from "../features/auth/authSlice";
import TagList from "../components/TagList";
import CommentForm from "../components/CommentForm";
function SingleAsset() {
    const { id: assetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { asset, isLoading, isError, message } = useSelector((state) => state.assets);
    const { viewedUser, isLoading: userLoading } = useSelector((state) => state.users);
    const { comments, isLoading: commentsLoading } = useSelector((state) => state.comments);
    const { user } = useSelector((state) => state.auth);
    const [mainPreview, setMainPreview] = useState('');
    const isFavorite = user?.favorites?.includes(assetId);
    const [showAllComments, setShowAllComments] = useState(false);
    const toggleComments = () => {
        setShowAllComments(prev => !prev);
    };
    const handleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorite(assetId));
        } else {
            dispatch(addFavorite(assetId));
        }
    };

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
               
                {asset?.ratingAverage !== undefined && (
                    <div className="asset-rating">
                        <p>{comments.length}</p>
                        <StarsRating rating={asset.ratingAverage}  />
                    </div>
                )}

                {/* Mostrar tags */}
                <TagList tags={asset?.tags} />
                <Link to={`/categories?user=${asset.user}`} >{viewedUser?.name}</Link>
                {/* Comentarios */}
                <div className="comments-section">
                    {(showAllComments ? comments : comments.slice(0, 0)).map(comment => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}
                    {comments.length > 0 && (
                        <button onClick={toggleComments} className="btn btn-link">
                            {showAllComments ? 'Ocultar comentarios' : 'Ver comentarios'}
                        </button>
                    )}
                    <CommentForm />
                </div>
            </div>
            <div className="botones-guardado">
                <button
                    className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'}`}
                    onClick={handleFavorite}
                >
                    <FaHeart />
                </button>
                <button className="btn btn-secondary"><FaDownload></FaDownload></button>
            </div>



        </div>
    );
}

export default SingleAsset;
