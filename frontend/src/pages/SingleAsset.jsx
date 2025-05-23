import { useEffect, useState } from "react";
import { FaHeart, FaDownload, FaRegHeart } from "react-icons/fa";
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
import JSZip from "jszip";
import { saveAs } from "file-saver";
function SingleAsset() {
    const { id: assetId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { asset, isLoading, isError, message } = useSelector((state) => state.assets);
    const { comments, isLoading: commentsLoading } = useSelector((state) => state.comments);
    const { user } = useSelector((state) => state.auth);
    const [mainPreview, setMainPreview] = useState(null);
    const isFavorite = user?.favorites?.includes(assetId);
    const [showAllComments, setShowAllComments] = useState(false);

    const [assetOwner, setAssetOwner] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        document.title = "AssetVerse | Single Asset";
    }, []);

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



    const handleDownload = async () => {
        if ((!asset?.files || asset.files.length === 0) && (!asset?.mainImage || asset.mainImage.length === 0)) {
            alert("No hay archivos para descargar.");
            return;
        }

        const zip = new JSZip();
        const filesFolder = zip.folder("files");

        const fetchAndAddToZip = async (url, name, folder) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                folder.file(name, blob);
            } catch (err) {
                console.error(`Error al descargar: ${name}`, err);
            }
        };

        const filePromises = asset.files?.map(file =>
            fetchAndAddToZip(file.url || file.path, file.filename || "file", filesFolder)
        );

        const imagePromises = asset.mainImage?.map(img =>
            fetchAndAddToZip(img.url || img.path, img.filename || "mainImage", filesFolder)
        );

        await Promise.all([...filePromises, ...imagePromises]);

        zip.generateAsync({ type: "blob" }).then((zipBlob) => {
            saveAs(zipBlob, `${asset.title || 'asset'}.zip`);
        });
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
        if (asset && asset.mainImage?.[0]) {
            setMainPreview(asset.mainImage[0]);
        } else {
            setMainPreview(null);
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
            <div className="imagenes">
                <div className="mostrando">
                    {!mainPreview ? (
                        <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
                            No hay vista previa disponible para este archivo.
                        </div>
                    ) : mainPreview.mimetype?.startsWith('image/') ? (
                        <img
                            src={mainPreview.url || mainPreview.path}
                            className="mainImage"
                            alt={mainPreview.filename}
                        />
                    ) : mainPreview.mimetype?.startsWith('video/') ? (
                        <video
                            src={mainPreview.url || mainPreview.path}
                            className="mainImage"
                            controls
                            style={{ width: '350px', maxHeight: '500px' }}
                        />
                    ) : mainPreview.mimetype === 'application/pdf' ? (
                        <iframe
                            src={mainPreview.url || mainPreview.path}
                            className="mainImage"
                            title="PDF Preview"
                            type="application/pdf"
                            style={{ width: '700px', height: '500px', border: 'none' }}
                        />
                    ) : mainPreview.filename?.endsWith('.glb') || mainPreview.filename?.endsWith('.gltf') ? (
                        <model-viewer className="tresd"
                            src={mainPreview.url || mainPreview.path}
                            alt="3D model"
                            auto-rotate
                            camera-controls
                            style={{ width: '350px', height: '350px' }}
                        />
                    ) : (
                        <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
                            Vista previa no disponible para este tipo de archivo.
                        </div>
                    )}
                </div>


                {/* Miniaturas */}
                <div className="miniaturas">
                    {asset.mainImage && asset.mainImage.map((img, index) => (
                        <img
                            key={`main-${index}`}
                            src={img.url || img.path}
                            alt={img.filename}
                            className="miniatura"
                            style={{
                                opacity: (mainPreview?.url || mainPreview?.path) === (img.url || img.path) ? '0.5' : '1',
                                cursor: 'pointer'
                            }}
                            onClick={() => setMainPreview(img)}
                        />
                    ))}

                    {asset.files && asset.files.map((file, index) => {
                        const isImage = file.mimetype?.startsWith('image/');
                        const isVideo = file.mimetype?.startsWith('video/');
                        const isPDF = file.mimetype === 'application/pdf';
                        const is3DModel = file.filename?.endsWith('.glb') || file.filename?.endsWith('.gltf');

                        const handleClick = () => setMainPreview(file);

                        return (
                            <div
                                key={`file-${index}`}
                                className="miniatura"
                                onClick={handleClick}
                                style={{
                                    opacity: (mainPreview?.url || mainPreview?.path) === (file.url || file.path) ? '0.5' : '1',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',

                                }}
                            >
                                {isImage ? (
                                    <img src={file.url || file.path} alt={file.filename} className="miniatura" />
                                ) : isVideo ? (
                                    <div style={{ fontSize: '20px' }}>🎥</div>
                                ) : isPDF ? (
                                    <div style={{ fontSize: '20px' }}>📄</div>
                                ) : is3DModel ? (
                                    <div style={{ fontSize: '20px' }}>🧊</div>
                                ) : (
                                    <div style={{ fontSize: '20px' }}>📁</div>
                                )}
                                {!isImage ? (
                                    <p style={{ fontSize: '11px', marginTop: '4px', overflowWrap: 'break-word' }}>
                                        {file.filename}
                                    </p>
                                ):
                                (
                                    <p></p>
                                )}

                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Detalles del asset */}
            <div className="asset-details">
                <button onClick={() => navigate(`/asset/${assetId}`)}>Edit ✎</button>


                <h2>{asset?.title}</h2>
                <p>{asset?.desc}</p>
                <TagList className="tags" tags={asset?.tags} />
                <p className="byuser">
                    {loadingUser ? 'Loading user...' : (
                        <Link to={`/categories?user=${asset.user}`}>
                            by {assetOwner?.name}
                        </Link>
                    )}
                </p>
                {asset?.ratingAverage !== undefined && (
                    <div className="asset-rating">
                        <div>
                            <p>{comments.length}</p>
                            <StarsRating rating={asset.ratingAverage} />
                        </div>
                        {comments.length > 0 && (
                            <button onClick={toggleComments} className="btn btn-link">
                                {showAllComments ? 'Ocultar comentarios' : 'Ver comentarios'}
                            </button>
                        )}
                    </div>
                )}
                {(showAllComments ? comments : comments.slice(0, 0)).map(comment => (
                    <CommentItem key={comment._id} comment={comment} />
                ))}
                {/* Comentarios */}
                {user ? (
                    user._id !== asset?.user ? (

                        <div className="comments-section">

                            <CommentForm />
                        </div>
                    ) : (
                        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#777' }}>
                            You can't comment on your own asset.
                        </p>
                    )
                ) : null}
            </div>

            <div className="botones-guardado">
                <button title="favourite"
                    className={`btn ${isFavorite ? 'favorito' : 'no-favorito'}`}
                    onClick={handleFavorite}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button title="download" className="btn btn-secondary" onClick={handleDownload}>
                    <FaDownload />
                </button>
            </div>
        </div>
    );
}

export default SingleAsset;
