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
    const { comments, isLoading: commentsLoading } = useSelector((state) => state.comments);
    const { user } = useSelector((state) => state.auth);
    const [mainPreview, setMainPreview] = useState('');
    const isFavorite = user?.favorites?.includes(assetId);
    const [showAllComments, setShowAllComments] = useState(false);

    const [assetOwner, setAssetOwner] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
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
            dispatch(getAssetComments(assetId));
        }

        return () => {
            dispatch(reset());
        };
    }, [dispatch, assetId, isError, message]);

    useEffect(() => {
        if (asset && asset.mainImage?.[0]?.filename) {
            setMainPreview(`http://localhost:5000/uploads/${asset.mainImage[0].filename}`);
        }
        
            const fetchUser = async () => {
                setLoadingUser(true);
                try {
                    const action = await dispatch(getUserById(asset.user));
                    const userData = action.payload;
                    setAssetOwner(userData);
                } catch (err) {
                    console.error("Error al cargar el usuario", err);
                } finally {
                    setLoadingUser(false);
                }
            };
        
            if (asset?.user) {
                fetchUser();
            }
        
        
    }, [asset, dispatch]);
    
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="single-asset">
            {/* Imagen principal */}
            <div className="mostrando">
                {mainPreview === 'NO_PREVIEW' ? (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
                        No hay vista previa disponible para este archivo.
                    </div>
                ) : (
                    mainPreview && (
                        <img
                            src={mainPreview}
                            className="mainImage"
                            alt="Imagen principal"
                        />
                    )
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
                        style={{
                            opacity: mainPreview.includes(img.filename) ? '0.5' : '1',
                            cursor: 'pointer'
                        }}
                        onClick={() => setMainPreview(`http://localhost:5000/uploads/${img.filename}`)}
                    />
                ))}

                {asset.files && asset.files.map((file, index) => {
                    const isImage = file.mimetype.startsWith('image/');

                    return (
                        <div
                            key={`file-${index}`}
                           
                            style={{
                                opacity: mainPreview.includes(file.filename) ? '0.5' : '1'}}
                            onClick={() => {
                                if (isImage) {
                                    setMainPreview(`http://localhost:5000/uploads/${file.filename}`);
                                } else {
                                    setMainPreview('NO_PREVIEW');
                                }
                            }}
                        >
                            {isImage ? (
                                <img
                                    src={`http://localhost:5000/uploads/${file.filename}`}
                                    alt={file.filename}
                                    className="miniatura"
                                />
                            ) : (
                                <div className="miniatura no-image">
                                    <p style={{ fontSize: '30px', marginBottom: '5px' }}>📄</p>
                                    <p style={{ fontSize: '12px', overflowWrap: 'break-word' }}>{file.mimetype}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Detalles del asset */}
            <div className="asset-details">
                <h2>{asset?.title}</h2>
                <p>{asset?.desc}</p>
                <TagList className="tags" tags={asset?.tags} />
                <p>
                {loadingUser ? 'Loading user...' : (
                    <Link to={`/categories?user=${asset.user}`}>
                    by {assetOwner?.name}
                    </Link>
                )}
                </p>
                {asset?.ratingAverage !== undefined && (
                    <div className="asset-rating">
                        <p>{comments.length}</p>
                        <StarsRating rating={asset.ratingAverage} />
                        {comments.length > 0 && (
                        <button onClick={toggleComments} className="btn btn-link">
                            {showAllComments ? 'Ocultar comentarios' : 'Ver comentarios'}
                        </button>
                    )}
                    </div>
                )}

                

                {/* Comentarios */}
                {user && user._id !== asset?.user && (
                    <div className="comments-section">
                        {(showAllComments ? comments : comments.slice(0, 0)).map(comment => (
                            <CommentItem key={comment._id} comment={comment} />
                        ))}
                        
                        <CommentForm />
                    </div>
                )}
            </div>

            <div className="botones-guardado">
                <button
                    className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'}`}
                    onClick={handleFavorite}
                >
                    <FaHeart />
                </button>
                <button className="btn btn-secondary">
                    <FaDownload />
                </button>
            </div>
        </div>
    );
}

export default SingleAsset;
